from typing import List, Dict, Any, Optional
from datetime import datetime
import httpx
from .base import BaseConnector, ConnectorError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class GoogleFactCheckConnector(BaseConnector):
    """Google Fact Check Tools API connector"""

    def __init__(self, cache_client=None):
        super().__init__(cache_client)
        self.api_key = settings.GOOGLE_FACTCHECK_KEY
        self.base_url = "https://factchecktools.googleapis.com/v1alpha1"

    def fetch_recent(self, window_days: int = 1, page: int = 1) -> List[Dict[str, Any]]:
        """Fetch recent fact-checks"""
        return []

    def search(
        self,
        query: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        page: int = 1,
    ) -> List[Dict[str, Any]]:
        """Search fact-checks by query"""
        if self.disabled or not self.api_key:
            return []

        cache_key = self._get_cache_key("search", query=query, page=page)
        cached = self._get_cached(cache_key)
        if cached:
            return cached

        try:
            url = f"{self.base_url}/claims:search"
            params = {
                "key": self.api_key,
                "query": query,
                "pageSize": 10,
            }

            with httpx.Client(timeout=30.0) as client:
                response = client.get(url, params=params)
                response.raise_for_status()
                data = response.json()

            items = []
            for claim_review in data.get("claims", []):
                if not claim_review.get("claimReview"):
                    continue

                review = claim_review["claimReview"][0]
                publisher = review.get("publisher", {})

                published_at = None
                if review.get("reviewDate"):
                    try:
                        published_at = datetime.fromisoformat(
                            review["reviewDate"].replace("Z", "+00:00")
                        )
                    except Exception:
                        pass

                item = self._normalize_item(
                    source_name=publisher.get("name", "Unknown"),
                    source_domain=publisher.get("site", "factcheck.org"),
                    url=review.get("url", ""),
                    title=claim_review.get("text", ""),
                    body_text=f"{review.get('title', '')} - {review.get('textualRating', '')}",
                    published_at=published_at,
                    raw_json=claim_review,
                )
                items.append(item)

            self._set_cache(cache_key, items, settings.CACHE_TTL_FACTCHECK)
            self._handle_success()
            return items

        except Exception as e:
            logger.error(f"Google FactCheck search error: {e}")
            self._handle_failure()
            raise ConnectorError(f"Google FactCheck error: {e}")

    def fetch_by_url(self, url: str) -> Optional[Dict[str, Any]]:
        """Fetch fact-check by URL"""
        return None
