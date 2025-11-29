from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "TruthVerse"
    APP_ENV: str = "development"
    DEBUG: bool = True
    DEMO_MODE: bool = False
    SECRET_KEY: str = "change-me-in-production"

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    DATABASE_URL: str = "sqlite:///./truthverse.db"

    REDIS_URL: str = "redis://localhost:6379/0"

    ELASTICSEARCH_URL: str = "http://localhost:9200"
    ES_INDEX_NAME: str = "truthverse_snippets"
    USE_FTS_FALLBACK: bool = True

    NEWSAPI_KEY: Optional[str] = None
    NEWSCATCHER_KEY: Optional[str] = None
    MEDIASTACK_KEY: Optional[str] = None
    GOOGLE_FACTCHECK_KEY: Optional[str] = None
    RELIEFWEB_KEY: Optional[str] = None
    OPENFDA_KEY: Optional[str] = None
    NCBI_KEY: Optional[str] = None

    HF_API_KEY: Optional[str] = None
    USE_HF_INFERENCE: bool = False

    CLAIM_DETECTOR_MODEL: str = "microsoft/deberta-v3-small"
    EMBEDDING_MODEL: str = "sentence-transformers/all-mpnet-base-v2"
    NLI_MODEL: str = "facebook/bart-large-mnli"
    EXPLANATION_MODEL: str = "google/flan-t5-base"

    CACHE_TTL_NEWS: int = 3600
    CACHE_TTL_FACTCHECK: int = 86400
    CACHE_TTL_VERIFY: int = 86400

    RATE_LIMIT_PUBLIC: int = 60
    RATE_LIMIT_VERIFY: int = 10
    RATE_LIMIT_AI_CHAT: int = 5

    FREE_CHATS_PER_DAY: int = 5
    FREE_VERIFIES_PER_DAY: int = 10

    SCORE_VERIFIED_MIN: int = 70
    SCORE_FAKE_MAX: int = 40

    SENTRY_DSN: Optional[str] = None
    PROMETHEUS_ENABLED: bool = True

    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    CORS_ORIGINS: str = "http://localhost:8080,http://localhost:3000"

    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
