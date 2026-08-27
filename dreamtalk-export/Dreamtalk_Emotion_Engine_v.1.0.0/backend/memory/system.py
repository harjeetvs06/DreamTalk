"""
Simplified Memory System for Groq-only setup.

This version avoids heavy local ML dependencies (faiss, torch, sentence-transformers)
and provides a lightweight 3-layer memory suitable for use with a hosted LLM
service (Groq). LTM is stored as a simple append-only corpus with naive
text matching for retrieval.
"""

import os
import json
from typing import List, Dict, Optional


class MemorySystem:
    def __init__(self):
        # Layer 1: Short-Term Memory (Session Buffer)
        self.stm: List[Dict] = []
        self.stm_limit = 20

        # Layer 2: Long-Term Memory (Simple corpus, no embeddings)
        self.ltm_corpus: List[Dict] = []

        # Layer 3: Emotional Memory
        self.emotional_history: List[Dict] = []

        # Persistent storage paths
        self.base_path = "data/memory"
        os.makedirs(self.base_path, exist_ok=True)

    def add_interaction(self, user_input: str, response: str, emotion: Dict):
        interaction = {
            "user": user_input,
            "assistant": response,
            "emotion": emotion,
            "timestamp": str(__import__('time').time())
        }

        # Update STM
        self.stm.append(interaction)
        if len(self.stm) > self.stm_limit:
            # When STM overflows, push oldest to LTM
            oldest = self.stm.pop(0)
            self._add_to_ltm(oldest)

        # Update Emotional Memory
        self.emotional_history.append({
            "emotion": emotion.get("name", "neutral"),
            "vad": emotion.get("vad", None),
            "timestamp": interaction["timestamp"]
        })

    def _add_to_ltm(self, interaction: Dict):
        """Append to simple LTM corpus."""
        self.ltm_corpus.append(interaction)

    def retrieve_context(self, query: str, k: int = 5) -> Dict:
        """Retrieve context: STM, naive LTM matches, and recent emotions."""
        # 1. STM
        stm_context = self.stm[-5:] if self.stm else []

        # 2. Naive LTM Search: substring matching (simple, fast)
        ltm_results: List[Dict] = []
        if self.ltm_corpus:
            q = (query or "").lower()
            for item in reversed(self.ltm_corpus):
                text = f"User: {item.get('user','')} Assistant: {item.get('assistant','')}".lower()
                if not q or q in text:
                    ltm_results.append(item)
                if len(ltm_results) >= k:
                    break

        # 3. Emotional Resonance
        recent_emotions = [e["emotion"] for e in self.emotional_history[-10:]]

        return {
            "stm": stm_context,
            "ltm": ltm_results,
            "emotional_profile": recent_emotions
        }

    def save(self):
        with open(os.path.join(self.base_path, "ltm_corpus.json"), "w") as f:
            json.dump(self.ltm_corpus, f)
        with open(os.path.join(self.base_path, "emotional_history.json"), "w") as f:
            json.dump(self.emotional_history, f)

    def load(self):
        import os
        corpus_path = os.path.join(self.base_path, "ltm_corpus.json")
        if os.path.exists(corpus_path):
            with open(corpus_path, "r") as f:
                self.ltm_corpus = json.load(f)
        eh_path = os.path.join(self.base_path, "emotional_history.json")
        if os.path.exists(eh_path):
            with open(eh_path, "r") as f:
                self.emotional_history = json.load(f)
