"""
Avatar Module Orchestrator (HTTP side) for DreamTalk.

This service's ONLY job is to mint a LiveKit access token for the human
user and hand back the room name + server URL. It does NOT call Beyond
Presence directly — that happens inside worker.py, which runs as a
separate long-running LiveKit Agent process and auto-joins any room that
matches its dispatch rules.

Run this with: python main.py   (port 8001)
Run the worker separately with: python worker.py dev
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from livekit import api

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

app = FastAPI(title="DreamTalk Avatar Orchestrator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InitSessionRequest(BaseModel):
    avatar_id: str
    room_name: str
    user_id: str


@app.post("/api/avatar/session")
async def initialize_avatar_session(payload: InitSessionRequest):
    """
    Generates a LiveKit token for the human user to join the room.
    The avatar_id is embedded in the room name so worker.py can read it
    when it auto-dispatches into the room.
    """
    livekit_api_key = os.getenv("LIVEKIT_API_KEY")
    livekit_api_secret = os.getenv("LIVEKIT_API_SECRET")
    livekit_url = os.getenv("LIVEKIT_URL")

    if not all([livekit_api_key, livekit_api_secret, livekit_url]):
        raise HTTPException(status_code=500, detail="Missing LiveKit environment configuration.")

    # payload.room_name must already encode avatar_id so worker.py can parse it,
    # e.g. "room-<avatar_id>-<timestamp>" (this is what chat.tsx sends).
    room_name = payload.room_name
    if payload.avatar_id not in room_name:
        room_name = f"room-{payload.avatar_id}-{room_name}"

    try:
        token_builder = (
            api.AccessToken(livekit_api_key, livekit_api_secret)
            .with_identity(payload.user_id)
            .with_name(f"User_{payload.user_id[:8]}")
            .with_grants(
                api.VideoGrants(
                    room_join=True,
                    room=room_name,
                    can_publish=True,
                    can_subscribe=True,
                )
            )
        )
        user_token = token_builder.to_jwt()

        return {
            "status": "success",
            "token": user_token,
            "serverUrl": livekit_url,
            "room_name": room_name,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create avatar session: {str(e)}")


@app.get("/health")
async def health():
    return {"status": "online", "module": "avatar_module"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
