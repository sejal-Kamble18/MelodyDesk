from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/ai", tags=["ai"])


class FocusDjRequest(BaseModel):
    activity: str = Field(min_length=1, max_length=80)
    mood: str = Field(min_length=1, max_length=80)
    duration_minutes: int = Field(ge=1, le=240)
    preferred_genres: list[str] = Field(default_factory=list, max_length=8)


class FocusDjResponse(BaseModel):
    query: str
    energy: str
    reason: str


@router.post("/focus-dj", response_model=FocusDjResponse)
async def focus_dj(_: FocusDjRequest) -> FocusDjResponse:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="AI Focus DJ is ready for a provider key, but no AI provider is configured.",
    )
