from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import hashlib
import json
import logging
from tenacity import retry, stop_after_attempt, wait_exponential
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)


class ConnectorError(Exception):
    pass


class BaseConnector(ABC):
    def __init__(self, cache_client=None):
        self.cache_client = cache_client
        self.failure_count = 0
        self.max_failures = 5
        self.disabled = False

    def _get_cache_key(self, method: str, **kwargs) -> str:
        key_data = f"{self.__class__.__name__}:{method}:{json.dumps(kwargs, sort_keys=True)}"
        return hashlib.md5(key_data.encode()).hexdigest()

    def _get_cached(self, cache_key: str) -> Optional[Dict[str, Any]]:
        if not self.cache_client:
            return None
        try:
            cached = self.cache_client.get(cache_key)
            if cached:
                return json.loads(cached)
        except Exception as e:
            logger.warning(f"Cache get error: {e}")
        return None

    def _set_cache(self, cache_key: str, data: Any, ttl: int):
        if not self.cache_client:
            return
        try:
            self.cache_client.setex(cache_key, ttl, json.dumps(data))
        except Exception as e:
            logger.warning(f"Cache set error: {e}")

    def _handle_failure(self):
        self.failure_count += 1
        if self.failure_count >= self.max_failures:
            self.disabled = True
            logger.error(f"{self.__class__.__name__} disabled due to repeated failures")

    def _handle_success(self):
        self.failure_count = 0
        self.disabled = False

    def _normalize_item(
        self,
        source_name: str,
        source_domain: str,
        url: str,
        title: str,
        body_text: str,
        published_at: Optional[datetime],
        raw_json: Dict[str, Any],
    ) -> Dict[str, Any]:
        return {
            "source_name": source_name,
            "source_domain": source_domain,
            "url": url,
            "title": title,
            "body_text": body_text,
            "published_at": published_at.isoformat() if published_at else None,
            "raw_json": raw_json,
        }

    @abstractmethod
    def fetch_recent(self, window_days: int = 1, page: int = 1) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def search(
        self,
        query: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        page: int = 1,
    ) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def fetch_by_url(self, url: str) -> Optional[Dict[str, Any]]:
        pass
