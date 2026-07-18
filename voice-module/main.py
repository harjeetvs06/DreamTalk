"""
Voice Module for DreamTalk.
Standalone FastAPI service that wraps ElevenLabs Text-to-Speech.
Used for on-demand speech synthesis (e.g. voice previews, non-live playback).

Note: the LIVE avatar call pipeline does NOT go through this HTTP service —
the avatar_module's worker.py talks to ElevenLabs directly via the LiveKit
plugin for lower latency. This module is for standalone/one-off TTS requests
from the frontend (e.g. "preview this voice").
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import httpx

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

app = FastAPI(title="DreamTalk Voice Module")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
ELEVEN_BASE_URL = "https://api.elevenlabs.io/v1"
DEFAULT_VOICE_ID = os.getenv("ELEVEN_DEFAULT_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")


class SynthesizeRequest(BaseModel):
    text: str
    voice_id: str | None = None
    model_id: str | None = "eleven_multilingual_v2"


@app.post("/synthesize")
async def synthesize(payload: SynthesizeRequest):
    """
    Convert text to speech audio (mp3) using ElevenLabs.
    Returns raw audio bytes with audio/mpeg content type.
    """
    if not ELEVEN_API_KEY:
        raise HTTPException(status_code=500, detail="ELEVEN_API_KEY is not configured")

    voice_id = payload.voice_id or DEFAULT_VOICE_ID

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{ELEVEN_BASE_URL}/text-to-speech/{voice_id}",
                headers={
                    "xi-api-key": ELEVEN_API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "text": payload.text,
                    "model_id": payload.model_id,
                },
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"ElevenLabs API error: {response.text}",
            )

        return Response(content=response.content, media_type="audio/mpeg")

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Failed to reach ElevenLabs: {str(e)}")


@app.get("/voices")
async def list_voices():
    """List available ElevenLabs voices for the configured account."""
    if not ELEVEN_API_KEY:
        raise HTTPException(status_code=500, detail="ELEVEN_API_KEY is not configured")

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{ELEVEN_BASE_URL}/voices",
                headers={"xi-api-key": ELEVEN_API_KEY},
            )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Failed to reach ElevenLabs: {str(e)}")


@app.get("/health")
async def health():
    return {"status": "online", "module": "voice_module"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
