"""LLM service that prefers Groq (hosted) when configured, else falls back to Ollama."""

import logging
import asyncio
import os
from typing import List, Dict, AsyncGenerator

GROQ_KEY = os.getenv("GROQ_API_KEY")

if GROQ_KEY:
    from .groq_client import generate_response_async as groq_generate_response_async
else:
    try:
        import ollama
    except Exception:
        ollama = None


class LLMService:
    def __init__(self, model_name: str = "llama3:70b"):
        self.model_name = model_name
        self.system_prompt = ""
        self.context_window = 32768

    def set_system_prompt(self, prompt: str):
        self.system_prompt = prompt

    async def generate_streaming(self, messages: List[Dict]) -> AsyncGenerator[str, None]:
        """Stream tokens if supported. For Groq we don't implement streaming here; it's a simple wrapper."""
        full_messages = [{"role": "system", "content": self.system_prompt}] + messages
        if GROQ_KEY:
            # Groq client: no streaming implemented, return single chunk
            resp = await groq_generate_response_async(full_messages)
            yield resp
            return

        if ollama:
            try:
                stream = ollama.chat(
                    model=self.model_name,
                    messages=full_messages,
                    stream=True,
                    options={"num_ctx": self.context_window, "temperature": 0.8, "top_p": 0.9},
                )
                for chunk in stream:
                    if 'message' in chunk and 'content' in chunk['message']:
                        yield chunk['message']['content']
                        await asyncio.sleep(0)
            except Exception as e:
                logging.error(f"Ollama streaming error: {e}")
                yield f"[Error: LLM Engine (Ollama) failed.]"
        else:
            yield "[Error: No LLM configured: set GROQ_API_KEY or install ollama]"

    async def generate_response_async(self, messages: List[Dict]) -> str:
        full_messages = [{"role": "system", "content": self.system_prompt}] + messages
        if GROQ_KEY:
            try:
                return await groq_generate_response_async(full_messages)
            except Exception as e:
                logging.error(f"Groq client error: {e}")
                return "[Error: Groq call failed]"

        if ollama:
            try:
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: ollama.chat(model=self.model_name, messages=full_messages, options={"num_ctx": self.context_window})
                )
                return response.get('message', {}).get('content', str(response))
            except Exception as e:
                logging.error(f"Ollama error: {e}")
                return "[Error: LLM Connection Failed.]"

        return "[Error: No LLM configured]"


class PromptCompiler:
    @staticmethod
    def build_advanced_prompt(persona: Dict, emotion: Dict, context: Dict, brain_state: Dict) -> str:
        traits = persona.get("traits", {})
        layers = brain_state.get("layers", {})

        prompt = [
            f"IDENTITIY: You are {persona.get('name', 'DreamTalk')}. You are a digital human, NOT an AI.",
            f"PROFESSION: {persona.get('profession', 'Individual')}",
            f"RELATIONSHIP: {persona.get('relationship', 'Friend')}",
            "\nCOGNITIVE PROFILE (Big Five Traits):",
            f"- Extroversion: {traits.get('extroversion', 0.5)}",
            f"- Agreeableness: {traits.get('agreeableness', 0.5)}",
            f"- Neuroticism: {traits.get('neuroticism', 0.5)}",
            f"- Openness: {traits.get('openness', 0.8)}",
            f"- Conscientiousness: {traits.get('conscientiousness', 0.5)}",
            "\nINTERNAL BRAIN STATE:",
            f"- Amygdala (Emotional Intensity): {layers.get('amygdala', {}).get('intensity', 0.0):.2f}",
            f"- PFC (Rational Override): {layers.get('pfc', {}).get('rational_override', 0.0):.2f}",
            f"- Neocortex (Creativity): {layers.get('neocortex', {}).get('creativity', 0.0):.2f}",
            "\nCURRENT EMOTION:",
            f"You are feeling **{emotion.get('display_name', emotion.get('name','neutral'))}** (Intensity: {emotion.get('intensity',1)})",
            "\nBEHAVIORAL DIRECTIVES:",
            "1. Speak naturally. Use filler words, contractions, and occasional imperfections.",
            "2. NEVER apologize unless it fits your current emotional state.",
            "3. NO corporate speak. No 'As an AI'. No 'I understand'.",
            "4. Match your response length to your emotional intensity.",
        ]

        if context.get("ltm"):
            prompt.append("\nRELEVANT MEMORIES:")
            for m in context["ltm"][:5]:
                prompt.append(f"- {m.get('timestamp','')}: User: {m.get('user','')} | You: {m.get('assistant','')}")

        return "\n".join(prompt)
