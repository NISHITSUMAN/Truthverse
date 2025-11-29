from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from app.services.verification import VerificationService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class VerifyRequest(BaseModel):
    url: Optional[HttpUrl] = None
    text: Optional[str] = None


class EvidenceItem(BaseModel):
    snippet: str
    source: str
    stance: str
    nli_conf: float
    url: Optional[str] = None


class ClaimResult(BaseModel):
    id: str
    claim_text: str
    cred_score: float
    label: str
    explain_text: str
    evidence: List[EvidenceItem]


class VerifyResponse(BaseModel):
    claims: List[ClaimResult]
    processing_time: float
    checked_sources: int


@router.post("", response_model=VerifyResponse)
async def verify_content(request: VerifyRequest):
    """
    Verify a URL or text content for factual claims.

    Returns credibility scores, evidence, and explanations for detected claims.
    """
    if not request.url and not request.text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either 'url' or 'text' must be provided"
        )

    try:
        service = VerificationService()

        if request.url:
            result = await service.verify_url(str(request.url))
        else:
            result = await service.verify_text(request.text)

        return VerifyResponse(**result)

    except Exception as e:
        logger.error(f"Verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification failed: {str(e)}"
        )
