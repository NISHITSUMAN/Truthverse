from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import httpx
from .base import BaseConnector, ConnectorError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class NewsAPIConnector(BaseConnector):
    def __init__(self, cache_client=None):
        super().__init__(cache_client)
        self.api_key = settings.NEWSAPI_KEY
        self.base_url = "https://newsapi.org/v2"

    def fetch_recent(self, window_days: int = 1, page: int = 1) -> List[Dict[str, Any]]:
        if self.disabled or not self.api_key:
            return []

        cache_key = self._get_cache_key("fetch_recent", window_days=window_days, page=page)
        cached = self._get_cached(cache_key)
        if cached:
            return cached

        try:
            from_date = (datetime.utcnow() - timedelta(days=window_days)).strftime("%Y-%m-%d")
            url = f"{self.base_url}/everything"
            params = {
                "apiKey": self.api_key,
                "from": from_date,
                "sortBy": "publishedAt",
                "pageSize": 100,
                "page": page,
                "language": "en",
            }

            with httpx.Client(timeout=30.0) as client:
                response = client.get(url, params=params)
                response.raise_for_status()
                data = response.json()

            items = []
            for article in data.get("articles", []):
                if not article.get("url") or not article.get("title"):
                    continue

                published_at = None
                if article.get("publishedAt"):
                    try:
                        published_at = datetime.fromisoformat(
                            article["publishedAt"].replace("Z", "+00:00")
                        )
                    except Exception:
                        pass

                item = self._normalize_item(
                    source_name=article.get("source", {}).get("name", "Unknown"),
                    source_domain=self._extract_domain(article["url"]),
                    url=article["url"],
                    title=article["title"],
                    body_text=article.get("description", "") or article.get("content", ""),
                    published_at=published_at,
                    raw_json=article,
                )
                items.append(item)

            self._set_cache(cache_key, items, settings.CACHE_TTL_NEWS)
            self._handle_success()
            return items

        except Exception as e:
            logger.error(f"NewsAPI fetch_recent error: {e}")
            self._handle_failure()
            raise ConnectorError(f"NewsAPI error: {e}")

    def search(
        self,
        query: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        page: int = 1,
    ) -> List[Dict[str, Any]]:
        if self.disabled or not self.api_key:
            return []

        cache_key = self._get_cache_key(
            "search", query=query, start_date=start_date, end_date=end_date, page=page
        )
        cached = self._get_cached(cache_key)
        if cached:
            return cached

        try:
            url = f"{self.base_url}/everything"
            params = {
                "apiKey": self.api_key,
                "q": query,
                "sortBy": "relevancy",
                "pageSize": 100,
                "page": page,
                "language": "en",
            }

            if start_date:
                params["from"] = start_date.strftime("%Y-%m-%d")
            if end_date:
                params["to"] = end_date.strftime("%Y-%m-%d")

            with httpx.Client(timeout=30.0) as client:
                response = client.get(url, params=params)
                response.raise_for_status()
                data = response.json()

            items = []
            for article in data.get("articles", []):
                if not article.get("url") or not article.get("title"):
                    continue

                published_at = None
                if article.get("publishedAt"):
                    try:
                        published_at = datetime.fromisoformat(
                            article["publishedAt"].replace("Z", "+00:00")
                        )
                    except Exception:
                        pass

                item = self._normalize_item(
                    source_name=article.get("source", {}).get("name", "Unknown"),
                    source_domain=self._extract_domain(article["url"]),
                    url=article["url"],
                    title=article["title"],
                    body_text=article.get("description", "") or article.get("content", ""),
                    published_at=published_at,
                    raw_json=article,
                )
                items.append(item)

            self._set_cache(cache_key, items, settings.CACHE_TTL_NEWS)
            self._handle_success()
            return items

        except Exception as e:
            logger.error(f"NewsAPI search error: {e}")
            self._handle_failure()
            raise ConnectorError(f"NewsAPI error: {e}")

    def fetch_by_url(self, url: str) -> Optional[Dict[str, Any]]:
        return None

    def _extract_domain(self, url: str) -> str:
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            return parsed.netloc
        except Exception:
            return "unknown"
