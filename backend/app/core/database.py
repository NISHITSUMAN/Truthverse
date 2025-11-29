from supabase import create_client, Client
from typing import Optional
from .config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    _client: Optional[Client] = None

    @classmethod
    def get_client(cls) -> Client:
        if cls._client is None:
            if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
                raise ValueError("Supabase credentials not configured")
            cls._client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            logger.info("Supabase client initialized")
        return cls._client

    @classmethod
    def get_service_client(cls) -> Client:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
            raise ValueError("Supabase service credentials not configured")
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


db = Database()
