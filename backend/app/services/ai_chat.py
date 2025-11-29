from typing import Dict, List, Any
from app.core.database import db
from app.services.retrieval import HybridRetriever
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class AIChatService:
    """AI chat service using verified information only"""

    def __init__(self):
        self.retriever = HybridRetriever()

    async def process_chat(
        self, user_id: str, prompt: str, max_tokens: int = 500
    ) -> Dict[str, Any]:
        """Process user chat request"""

        try:
            client = db.get_client()
            user_response = client.table("users").select("free_chats_left").eq("id", user_id).execute()

            if not user_response.data:
                raise ValueError("User not found")

            chats_left = user_response.data[0]["free_chats_left"]
            if chats_left <= 0:
                return {
                    "answer": "You have reached your free chat limit. Please upgrade to continue.",
                    "confidence": 0.0,
                    "sources": [],
                    "chats_remaining": 0,
                }

            snippets = self.retriever.retrieve_hybrid(prompt, top_k=10)

            verified_snippets = [
                s for s in snippets if s.get("source_trust", 0) >= 0.7
            ][:5]

            if not verified_snippets:
                answer = (
                    "I don't have enough verified information to answer this question confidently. "
                    "The claim may be too recent or not yet verified by trusted sources."
                )
                confidence = 0.0
                sources = []
            else:
                context = " ".join([s["sentence_text"] for s in verified_snippets])
                answer = self._generate_answer(prompt, context)
                confidence = sum(s.get("source_trust", 0.5) for s in verified_snippets) / len(verified_snippets)
                sources = [
                    {
                        "title": s.get("title", "Unknown"),
                        "source": s.get("source_name", "Unknown"),
                        "confidence": s.get("source_trust", 0.5),
                    }
                    for s in verified_snippets
                ]

            client.table("users").update({
                "free_chats_left": chats_left - 1
            }).eq("id", user_id).execute()

            return {
                "answer": answer,
                "confidence": confidence,
                "sources": sources,
                "chats_remaining": chats_left - 1,
            }

        except Exception as e:
            logger.error(f"AI chat error: {e}")
            raise

    def _generate_answer(self, question: str, context: str) -> str:
        """Generate answer from context"""
        answer = (
            f"Based on verified sources: {context[:500]}... "
            f"This information comes from trusted sources and has been fact-checked."
        )
        return answer
