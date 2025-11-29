from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from app.services.ai_chat import AIChatService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class ChatRequest(BaseModel):
    user_id: str
    prompt: str
    max_tokens: int = 500


class ChatSource(BaseModel):
    title: str
    source: str
    confidence: float


class ChatResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[ChatSource]
    chats_remaining: int


@router.post("", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    """
    Ask AI questions based on verified information only.
    Rate-limited for free users.
    """
    try:
        service = AIChatService()
        result = await service.process_chat(
            user_id=request.user_id,
            prompt=request.prompt,
            max_tokens=request.max_tokens
        )
        return ChatResponse(**result)

    except Exception as e:
        logger.error(f"AI chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI chat failed: {str(e)}"
        )
