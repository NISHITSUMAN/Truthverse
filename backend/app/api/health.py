from fastapi import APIRouter, status
from pydantic import BaseModel
from app.core.config import settings
from app.core.database import db
import redis
from datetime import datetime

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    demo_mode: bool
    database: str
    cache: str


@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def health_check():
    db_status = "ok"
    try:
        client = db.get_client()
        client.table("sources").select("id").limit(1).execute()
    except Exception as e:
        db_status = f"error: {str(e)}"

    cache_status = "ok"
    try:
        r = redis.from_url(settings.REDIS_URL)
        r.ping()
    except Exception as e:
        cache_status = f"error: {str(e)}"

    return HealthResponse(
        status="healthy" if db_status == "ok" and cache_status == "ok" else "degraded",
        timestamp=datetime.utcnow(),
        version="1.0.0",
        demo_mode=settings.DEMO_MODE,
        database=db_status,
        cache=cache_status,
    )
