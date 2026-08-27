"""Hardcoded audio responder mappings.

This module provides a simple phrase -> response mapping for common
utterances. It is intentionally simple and deterministic so that
short greetings or check-ins can be handled locally without calling
the external brain module.

The worker yields the returned text to the TTS plugin so the avatar
will speak the response.
"""
from typing import Optional


_TRIGGERS = [
    ("hey how are you", "Hey! I'm doing well, thanks for asking. How can I help you today?"),
    ("how are you", "I'm doing well — ready when you are."),
    ("what's wrong", "Nothing's wrong with me. Is there something you're worried about?"),
    ("whats wrong", "Nothing's wrong with me. Is there something you're worried about?"),
    ("are you okay", "Yes, I'm okay. Thanks for checking in."),
    ("are you ok", "Yes, I'm okay. Thanks for checking in."),
    ("hello", "Hello! Nice to hear from you."),
    ("hi", "Hi there! What would you like to talk about?"),
]


def check_hardcoded_response(user_text: str) -> Optional[str]:
    """Return a hardcoded response for `user_text` or None.

    Matching is case-insensitive and does a simple substring check.
    """
    if not user_text:
        return None

    txt = user_text.strip().lower()

    # Exact/substring matches — prefer longer triggers first
    for trigger, response in sorted(_TRIGGERS, key=lambda t: -len(t[0])):
        if trigger in txt:
            return response

    return None
