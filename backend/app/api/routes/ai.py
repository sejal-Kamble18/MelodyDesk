import json
from typing import Any

import httpx
from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.config import get_settings

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


ENERGY_BY_MOOD = {
    "calm": "low",
    "tired": "low",
    "anxious": "low",
    "focused": "medium",
    "neutral": "medium",
    "creative": "medium",
    "energized": "high",
    "workout": "high",
}


def _fallback_recommendation(request: FocusDjRequest) -> FocusDjResponse:
    genres = [genre.strip() for genre in request.preferred_genres if genre.strip()]
    mood = request.mood.strip().lower()
    activity = request.activity.strip().lower()
    energy = next((value for key, value in ENERGY_BY_MOOD.items() if key in mood or key in activity), "medium")

    if request.duration_minutes >= 90 and energy == "high":
        energy = "medium"
    if request.duration_minutes <= 15 and energy == "low":
        energy = "medium"

    genre_part = " ".join(genres[:2]) if genres else "instrumental focus"
    query = f"{activity} {genre_part} {energy} energy focus".strip()
    return FocusDjResponse(
        query=query,
        energy=energy,
        reason="Local Focus DJ planner used because no server-side LLM key is configured.",
    )


def _extract_json(payload: dict[str, Any]) -> dict[str, Any] | None:
    content = payload.get("choices", [{}])[0].get("message", {}).get("content")
    if not isinstance(content, str):
        return None
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        return None
    return parsed if isinstance(parsed, dict) else None


async def _openai_recommendation(request: FocusDjRequest) -> FocusDjResponse | None:
    settings = get_settings()
    if not settings.openai_api_key:
        return None

    schema = {
        "type": "json_schema",
        "json_schema": {
            "name": "focus_dj_recommendation",
            "strict": True,
            "schema": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "query": {"type": "string"},
                    "energy": {"type": "string", "enum": ["low", "medium", "high"]},
                    "reason": {"type": "string"},
                },
                "required": ["query", "energy", "reason"],
            },
        },
    }

    body = {
        "model": settings.openai_model,
        "messages": [
            {
                "role": "system",
                "content": "Return concise JSON for a focus music search. Avoid unsafe or unauthorized playback claims.",
            },
            {
                "role": "user",
                "content": (
                    f"Activity: {request.activity}\n"
                    f"Mood: {request.mood}\n"
                    f"Duration minutes: {request.duration_minutes}\n"
                    f"Preferred genres: {', '.join(request.preferred_genres) or 'none'}"
                ),
            },
        ],
        "response_format": schema,
        "temperature": 0.4,
    }

    try:
        async with httpx.AsyncClient(timeout=18) as client:
            response = await client.post(
                f"{settings.openai_base_url.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.openai_api_key.get_secret_value()}",
                    "Content-Type": "application/json",
                },
                json=body,
            )
        response.raise_for_status()
    except httpx.HTTPError:
        return None

    parsed = _extract_json(response.json())
    if not parsed:
        return None

    try:
        return FocusDjResponse.model_validate(parsed)
    except ValueError:
        return None


@router.post("/focus-dj", response_model=FocusDjResponse)
async def focus_dj(request: FocusDjRequest) -> FocusDjResponse:
    return await _openai_recommendation(request) or _fallback_recommendation(request)
