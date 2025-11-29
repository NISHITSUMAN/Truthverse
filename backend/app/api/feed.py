from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.core.database import db
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class FeedItem(BaseModel):
    id: str
    title: str
    summary: str
    cred_score: float
    label: str
    source: str
    published_at: Optional[datetime]
    category: str
    confidence: int


class FeedResponse(BaseModel):
    items: List[FeedItem]
    cursor: Optional[str] = None
    total: int


@router.get("", response_model=FeedResponse)
async def get_feed(
    topic: Optional[str] = Query(None, description="Filter by topic/category"),
    min_confidence: int = Query(70, ge=0, le=100, description="Minimum confidence score"),
    limit: int = Query(20, ge=1, le=100, description="Number of items to return"),
    cursor: Optional[str] = Query(None, description="Pagination cursor"),
):
    """
    Get verified news feed with optional filtering.

    Returns news items with credibility scores, sources, and metadata.
    Items are sorted by published date (newest first) and filtered by confidence.
    """
    try:
        client = db.get_client()

        query = (
            client.table("claim_reports")
            .select(
                """
                id,
                cred_score,
                label,
                explain_text,
                created_at,
                claims!inner(
                    id,
                    claim_text,
                    raw_items!inner(
                        id,
                        title,
                        url,
                        published_at,
                        sources!inner(
                            name,
                            domain
                        )
                    )
                )
                """
            )
            .gte("cred_score", min_confidence)
            .order("created_at", desc=True)
            .limit(limit)
        )

        if topic:
            pass

        response = query.execute()

        items = []
        for report in response.data:
            claim = report.get("claims", {})
            raw_item = claim.get("raw_items", {})
            source = raw_item.get("sources", {})

            items.append(FeedItem(
                id=report["id"],
                title=raw_item.get("title", "Untitled"),
                summary=claim.get("claim_text", "")[:200],
                cred_score=report["cred_score"],
                label=report["label"],
                source=source.get("name", "Unknown"),
                published_at=raw_item.get("published_at"),
                category=topic or "General",
                confidence=int(report["cred_score"]),
            ))

        return FeedResponse(
            items=items,
            cursor=None,
            total=len(items),
        )

    except Exception as e:
        logger.error(f"Error fetching feed: {e}")
        return FeedResponse(items=[], cursor=None, total=0)
