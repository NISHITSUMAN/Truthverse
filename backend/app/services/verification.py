import time
import hashlib
from typing import List, Dict, Any
from app.core.database import db
from app.services.claim_extraction import ClaimExtractor
from app.services.retrieval import HybridRetriever
from app.services.nli import NLIService
from app.services.scoring import ScoringService
from app.connectors.newsapi_connector import NewsAPIConnector
import logging

logger = logging.getLogger(__name__)


class VerificationService:
    def __init__(self):
        self.claim_extractor = ClaimExtractor()
        self.retriever = HybridRetriever()
        self.nli_service = NLIService()
        self.scoring_service = ScoringService()
        self.news_connector = NewsAPIConnector()

    async def verify_url(self, url: str) -> Dict[str, Any]:
        """Verify claims in a URL"""
        start_time = time.time()

        try:
            item = self.news_connector.fetch_by_url(url)
            if not item:
                items = self.news_connector.search(url, page=1)
                if items:
                    item = items[0]

            if not item:
                return {
                    "claims": [],
                    "processing_time": time.time() - start_time,
                    "checked_sources": 0,
                }

            text = f"{item['title']} {item['body_text']}"
            return await self.verify_text(text)

        except Exception as e:
            logger.error(f"URL verification error: {e}")
            return {
                "claims": [],
                "processing_time": time.time() - start_time,
                "checked_sources": 0,
            }

    async def verify_text(self, text: str) -> Dict[str, Any]:
        """Verify claims in text"""
        start_time = time.time()
        checked_sources = 0

        claims = self.claim_extractor.extract_claims(text)

        results = []
        for claim_text in claims[:5]:
            try:
                snippets = self.retriever.retrieve_hybrid(claim_text, top_k=20)
                checked_sources = len(set(s.get("source_id") for s in snippets))

                evidence_items = []
                supporting = []
                contradicting = []

                for snippet in snippets[:10]:
                    stance_result = self.nli_service.get_stance(
                        claim_text, snippet["sentence_text"]
                    )

                    evidence_items.append({
                        "snippet": snippet["sentence_text"],
                        "source": snippet.get("source_name", "Unknown"),
                        "stance": stance_result["stance"],
                        "nli_conf": stance_result["score"],
                        "url": snippet.get("url"),
                    })

                    if stance_result["stance"] == "support":
                        supporting.append({
                            "stance": stance_result["stance"],
                            "nli_conf": stance_result["score"],
                            "source_trust": snippet.get("source_trust", 0.5),
                        })
                    elif stance_result["stance"] == "contradict":
                        contradicting.append({
                            "stance": stance_result["stance"],
                            "nli_conf": stance_result["score"],
                            "source_trust": snippet.get("source_trust", 0.5),
                        })

                score_result = self.scoring_service.compute_score(
                    supporting=supporting,
                    contradicting=contradicting,
                )

                results.append({
                    "id": hashlib.md5(claim_text.encode()).hexdigest(),
                    "claim_text": claim_text,
                    "cred_score": score_result["cred_score"],
                    "label": score_result["label"],
                    "explain_text": score_result["explanation"],
                    "evidence": evidence_items[:5],
                })

            except Exception as e:
                logger.error(f"Claim verification error: {e}")
                continue

        return {
            "claims": results,
            "processing_time": time.time() - start_time,
            "checked_sources": checked_sources,
        }
