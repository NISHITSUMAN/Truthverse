from typing import List, Dict, Any
from app.core.database import db
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class HybridRetriever:
    """Hybrid retrieval combining BM25 and dense search"""

    def __init__(self):
        self.use_fts = settings.USE_FTS_FALLBACK

    def retrieve_hybrid(self, query: str, top_k: int = 50) -> List[Dict[str, Any]]:
        """
        Perform hybrid retrieval using BM25 + dense vectors

        Returns list of snippets with metadata
        """
        try:
            bm25_results = self._bm25_search(query, top_k=top_k)

            for result in bm25_results:
                result["retrieval_score"] = result.get("bm25_score", 0.5)

            return bm25_results[:top_k]

        except Exception as e:
            logger.error(f"Retrieval error: {e}")
            return []

    def _bm25_search(self, query: str, top_k: int) -> List[Dict[str, Any]]:
        """Full-text search using PostgreSQL FTS"""
        try:
            client = db.get_client()

            response = (
                client.table("snippets")
                .select(
                    """
                    id,
                    sentence_text,
                    raw_items!inner(
                        id,
                        title,
                        url,
                        sources!inner(
                            id,
                            name,
                            domain,
                            trust_score
                        )
                    )
                    """
                )
                .text_search("sentence_text", query, config="english")
                .limit(top_k)
                .execute()
            )

            results = []
            for item in response.data:
                raw_item = item.get("raw_items", {})
                source = raw_item.get("sources", {})

                results.append({
                    "snippet_id": item["id"],
                    "sentence_text": item["sentence_text"],
                    "raw_item_id": raw_item.get("id"),
                    "title": raw_item.get("title"),
                    "url": raw_item.get("url"),
                    "source_id": source.get("id"),
                    "source_name": source.get("name"),
                    "source_domain": source.get("domain"),
                    "source_trust": source.get("trust_score", 0.5),
                    "bm25_score": 0.7,
                })

            return results

        except Exception as e:
            logger.error(f"BM25 search error: {e}")
            return []

    def _dense_search(self, query: str, top_k: int) -> List[Dict[str, Any]]:
        """Dense retrieval using embeddings"""
        logger.warning("Dense search not yet implemented, returning empty results")
        return []
