from typing import Any

import httpx
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

router = APIRouter(prefix="/music", tags=["music"])

ITUNES_SEARCH_URL = "https://itunes.apple.com/search"
ITUNES_LOOKUP_URL = "https://itunes.apple.com/lookup"


class ProviderTrack(BaseModel):
    id: str
    provider: str
    providerTrackId: str
    title: str
    artist: str
    album: str | None = None
    artworkUrl: str | None = None
    durationSeconds: int
    streamUrl: str
    attribution: str
    playable: bool = True


class MusicSearchResponse(BaseModel):
    provider: str = "apple-preview"
    providerConfigured: bool = True
    tracks: list[ProviderTrack]
    attribution: str = "30-second previews provided by the iTunes Search API."


def _track(item: dict[str, Any]) -> ProviderTrack | None:
    preview = item.get("previewUrl")
    track_id = item.get("trackId")
    if not isinstance(preview, str) or not track_id:
        return None

    artwork = item.get("artworkUrl100")
    return ProviderTrack(
        id=f"apple-preview:{track_id}",
        provider="apple-preview",
        providerTrackId=str(track_id),
        title=str(item.get("trackName") or "Untitled preview"),
        artist=str(item.get("artistName") or "Unknown artist"),
        album=str(item.get("collectionName")) if item.get("collectionName") else None,
        artworkUrl=artwork.replace("100x100bb", "600x600bb") if isinstance(artwork, str) else None,
        durationSeconds=30,
        streamUrl=preview,
        attribution="iTunes preview",
    )


async def _itunes(params: dict[str, str | int]) -> list[ProviderTrack]:
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            response = await client.get(ITUNES_SEARCH_URL, params=params)
    except httpx.HTTPError as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Music provider search is unavailable.") from error
    if response.status_code >= 400:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Music provider search is unavailable.")

    results = response.json().get("results", [])
    return [track for item in results if isinstance(item, dict) and (track := _track(item))]


def _terms(query: str) -> list[str]:
    cleaned = query.strip()
    lower = cleaned.lower()
    if "old hindi" in lower:
        return ["old hindi songs", "kishore kumar", "lata mangeshkar", "mohammed rafi"]
    if "new hindi" in lower or "latest hindi" in lower:
        return ["new hindi songs", "arijit singh", "bollywood hits"]
    if lower in {"new songs", "latest songs"}:
        return ["top songs", "new music"]
    return [cleaned]


@router.get("/search", response_model=MusicSearchResponse)
async def search_music(q: str = Query(..., min_length=2, max_length=120), limit: int = Query(12, ge=1, le=25)) -> MusicSearchResponse:
    found: dict[str, ProviderTrack] = {}
    for term in _terms(q):
        for country in ("IN", "US", "GB"):
            if len(found) >= limit:
                break
            tracks = await _itunes({"term": term, "media": "music", "entity": "song", "limit": limit, "country": country})
            for track in tracks:
                found.setdefault(track.id, track)
                if len(found) >= limit:
                    break
    return MusicSearchResponse(tracks=list(found.values()))


@router.get("/resolve/{provider}/{track_id}", response_model=ProviderTrack)
async def resolve_track(provider: str, track_id: str) -> ProviderTrack:
    if provider != "apple-preview":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported music provider.")

    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            response = await client.get(ITUNES_LOOKUP_URL, params={"id": track_id, "entity": "song", "country": "US"})
    except httpx.HTTPError as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Music provider lookup is unavailable.") from error
    if response.status_code >= 400:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Music provider lookup is unavailable.")

    tracks = [_track(item) for item in response.json().get("results", []) if isinstance(item, dict)]
    track = next((item for item in tracks if item and item.providerTrackId == track_id), None)
    if not track:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Playable preview is unavailable for this track.")
    return track
