"""Minimal Groq client wrapper.

This is a lightweight helper that calls a Groq-compatible HTTP API.
Set `GROQ_API_KEY` and optionally `GROQ_API_URL` in your `.env`.
"""
import os
import asyncio
import logging
import aiohttp
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)
if not logger.handlers:
    # Basic configuration if the app hasn't configured logging yet
    logging.basicConfig(level=logging.INFO)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1/chat/completions")


async def generate_response_async(messages: List[Dict]) -> str:
    """Call Groq chat completion endpoint and return the assistant text.

    messages should be a list of {role, content} dicts similar to OpenAI/ChatAPI.
    """
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY not set")

    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    payload = {"model": GROQ_MODEL, "messages": messages, "max_tokens": 512}
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}

    try:
        logger.debug("Groq request url=%s payload=%s", GROQ_API_URL, payload)
        async with aiohttp.ClientSession() as session:
            async with session.post(
                GROQ_API_URL, json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=30)
            ) as resp:
                text = await resp.text()
                status = resp.status
                logger.info("Groq HTTP %s -> %s", status, GROQ_API_URL)
                # Try to parse JSON, but log raw text on failure
                try:
                    data: Optional[Dict] = await resp.json()
                except Exception:
                    logger.warning("Groq response not JSON; returning raw text. status=%s text=%s", status, text)
                    resp.raise_for_status()
                    return text
                if status >= 400:
                    # Log error body for debugging
                    logger.error("Groq error status=%s body=%s", status, data)
                    resp.raise_for_status()
    except aiohttp.ClientConnectorError as e:
        # DNS / connection-level errors surface here
        logger.exception("Groq connection error: %s", e)
        raise
    except Exception:
        logger.exception("Unexpected error calling Groq API")
        raise

    # Attempt to extract text from common response shapes
    if isinstance(data, dict):
        # OpenAI-like: data['choices'][0]['message']['content']
        choices = data.get("choices")
        if choices and isinstance(choices, list):
            first = choices[0]
            msg = first.get("message") or first.get("delta") or first
            if isinstance(msg, dict):
                return msg.get("content") or msg.get("text") or str(msg)
        # Direct field
        if "text" in data:
            return data["text"]

    return str(data)
