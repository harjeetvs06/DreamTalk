"""
Avatar Module Worker for DreamTalk.

A long-running LiveKit Agent process. It auto-joins any room a user connects
to (dispatched via main.py's token), and drives the full live pipeline:

  user mic audio
    -> STT (ElevenLabs, via livekit-plugins-elevenlabs)
    -> Brain Module (separate HTTP service, called from llm_node override)
    -> TTS (ElevenLabs, via livekit-plugins-elevenlabs)
    -> Beyond Presence avatar (lip-syncs to the TTS audio, streams video)

Run with:  python worker.py dev      (or `start` for production)

Install:
  pip install livekit-agents livekit-plugins-elevenlabs livekit-plugins-silero livekit-plugins-bey aiohttp python-dotenv
"""

import os
import logging
from pathlib import Path
from typing import AsyncIterable

import aiohttp
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    WorkerOptions,
    cli,
)
from livekit.agents.llm import ChatContext, ChatChunk
from livekit.plugins import elevenlabs, silero
from livekit.plugins.bey import AvatarSession

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

logger = logging.getLogger("dreamtalk-avatar-worker")
logger.setLevel(logging.INFO)

BRAIN_MODULE_URL = os.getenv("BRAIN_MODULE_URL", "http://localhost:8000")
ELEVEN_VOICE_ID = os.getenv("ELEVEN_VOICE_ID")  # optional, falls back to plugin default
DEFAULT_AVATAR_ID = os.getenv("DEFAULT_BEY_AVATAR_ID")  # fallback if room name has none


def extract_avatar_id(room_name: str) -> str:
    """
    Room names are created as 'room-<avatar_id>-<timestamp>' by the frontend.
    Pulls the avatar_id back out. Falls back to DEFAULT_AVATAR_ID if the
    pattern doesn't match (e.g. custom/manual room names).
    """
    if DEFAULT_AVATAR_ID:
        return DEFAULT_AVATAR_ID
    parts = room_name.split("-")
    if len(parts) >= 3 and parts[0] == "room":
        return "-".join(parts[1:-1])
    raise ValueError(f"Could not extract avatar_id from room name: {room_name}")


class BrainModuleAgent(Agent):
    """
    Overrides llm_node to call the external Brain Module HTTP API instead
    of using a built-in LLM plugin. Whatever this yields is passed straight
    into TTS by the framework.
    """

    def __init__(self, session_id: str):
        super().__init__(instructions="Respond naturally based on the brain module's output.")
        self.session_id = session_id

    async def llm_node(
        self, chat_ctx: ChatContext, tools, model_settings=None
    ) -> AsyncIterable[str]:
        # Find the most recent user message (the freshly transcribed speech)
        last_user_text = None
        for item in reversed(chat_ctx.items):
            if getattr(item, "role", None) == "user":
                last_user_text = getattr(item, "text_content", None) or str(item)
                break

        if not last_user_text:
            return

        try:
            async with aiohttp.ClientSession() as http:
                async with http.post(
                    f"{BRAIN_MODULE_URL}/chat",
                    json={"user_input": last_user_text, "session_id": self.session_id},
                    timeout=aiohttp.ClientTimeout(total=20),
                ) as resp:
                    if resp.status != 200:
                        error_body = await resp.text()
                        logger.error(f"Brain module error {resp.status}: {error_body}")
                        yield "Sorry, I'm having trouble thinking right now."
                        return
                    data = await resp.json()

            reply_text = data.get("response", "")
            if reply_text:
                yield reply_text

        except Exception as e:
            logger.exception(f"Failed to reach brain module: {e}")
            yield "Sorry, I lost connection to my brain module."


async def entrypoint(ctx: JobContext):
    await ctx.connect()

    avatar_id = extract_avatar_id(ctx.room.name)
    logger.info(f"Joining room '{ctx.room.name}' with avatar_id='{avatar_id}'")

    session = AgentSession(
        stt=elevenlabs.STT(),
        tts=elevenlabs.TTS(voice_id=ELEVEN_VOICE_ID) if ELEVEN_VOICE_ID else elevenlabs.TTS(),
        vad=silero.VAD.load(),
    )

    avatar = AvatarSession(avatar_id=avatar_id)
    await avatar.start(session, room=ctx.room)

    await session.start(
        room=ctx.room,
        agent=BrainModuleAgent(session_id=ctx.room.name),
    )


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
