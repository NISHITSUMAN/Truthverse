from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import db
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class ReviewRequest(BaseModel):
    action: str
    note: Optional[str] = None


class ReportedClaim(BaseModel):
    id: str
    claim_text: str
    report_count: int
    cred_score: float
    label: str


@router.get("/reported", response_model=List[ReportedClaim])
async def get_reported_claims():
    """
    Get list of claims reported by users.
    Requires moderator or admin role.
    """
    try:
        client = db.get_client()

        response = (
            client.table("reports")
            .select(
                """
                claim_id,
                claims!inner(
                    id,
                    claim_text,
                    claim_reports(cred_score, label)
                )
                """
            )
            .execute()
        )

        claim_counts = {}
        for report in response.data:
            claim_id = report["claim_id"]
            if claim_id not in claim_counts:
                claim = report.get("claims", {})
                claim_report = claim.get("claim_reports", [{}])[0] if claim.get("claim_reports") else {}
                claim_counts[claim_id] = {
                    "id": claim_id,
                    "claim_text": claim.get("claim_text", ""),
                    "cred_score": claim_report.get("cred_score", 0),
                    "label": claim_report.get("label", "unknown"),
                    "count": 0,
                }
            claim_counts[claim_id]["count"] += 1

        results = [
            ReportedClaim(
                id=data["id"],
                claim_text=data["claim_text"],
                report_count=data["count"],
                cred_score=data["cred_score"],
                label=data["label"],
            )
            for data in claim_counts.values()
        ]

        results.sort(key=lambda x: x.report_count, reverse=True)
        return results

    except Exception as e:
        logger.error(f"Error fetching reported claims: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch reported claims"
        )


@router.post("/review/{claim_id}")
async def review_claim(claim_id: str, request: ReviewRequest):
    """
    Review a reported claim.
    Updates claim status based on moderator action.
    """
    if request.action not in ["approve", "reject", "needs_review"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid action. Must be 'approve', 'reject', or 'needs_review'"
        )

    try:
        client = db.get_client()

        status_map = {
            "approve": "verified",
            "reject": "fake",
            "needs_review": "needs_review",
        }

        client.table("claims").update({
            "status": status_map[request.action]
        }).eq("id", claim_id).execute()

        return {"status": "success", "message": f"Claim {request.action}d"}

    except Exception as e:
        logger.error(f"Error reviewing claim: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to review claim"
        )
