import base64
from typing import Any

import httpx
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from app.core.config import get_settings

router = APIRouter(prefix="/music", tags=["music"])

ITUNES_SEARCH_URL = "https://itunes.apple.com/search"
ITUNES_LOOKUP_URL = "https://itunes.apple.com/lookup"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search"


class ProviderTrack(BaseModel):
    id: str
    provider: str
    providerTrackId: str
    title: str
    artist: str
    album: str | None = None
    artworkUrl: str | None = None
    durationSeconds: int
    streamUrl: str | None = None
    attribution: str
    playable: bool = True
    playbackKind: str = "preview"


class MusicSearchResponse(BaseModel):
    provider: str = "mixed"
    providerConfigured: bool = True
    tracks: list[ProviderTrack]
    attribution: str = "Catalog metadata and authorized previews only."


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
        playbackKind="preview",
    )


async def _spotify_token() -> str | None:
    settings = get_settings()
    if not settings.spotify_client_id or not settings.spotify_client_secret:
        return None

    credentials = f"{settings.spotify_client_id.get_secret_value()}:{settings.spotify_client_secret.get_secret_value()}"
    encoded = base64.b64encode(credentials.encode("utf-8")).decode("ascii")
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.post(
                SPOTIFY_TOKEN_URL,
                headers={"Authorization": f"Basic {encoded}"},
                data={"grant_type": "client_credentials"},
            )
        response.raise_for_status()
    except httpx.HTTPError:
        return None

    token = response.json().get("access_token")
    return token if isinstance(token, str) else None


def _spotify_track(item: dict[str, Any]) -> ProviderTrack | None:
    track_id = item.get("id")
    if not isinstance(track_id, str):
        return None

    album = item.get("album") if isinstance(item.get("album"), dict) else {}
    images = album.get("images") if isinstance(album.get("images"), list) else []
    artwork = next((image.get("url") for image in images if isinstance(image, dict) and isinstance(image.get("url"), str)), None)
    artists = item.get("artists") if isinstance(item.get("artists"), list) else []
    artist = ", ".join(artist.get("name") for artist in artists if isinstance(artist, dict) and isinstance(artist.get("name"), str))
    preview = item.get("preview_url")

    return ProviderTrack(
        id=f"spotify-catalog:{track_id}",
        provider="spotify-catalog",
        providerTrackId=track_id,
        title=str(item.get("name") or "Untitled track"),
        artist=artist or "Unknown artist",
        album=str(album.get("name")) if album.get("name") else None,
        artworkUrl=artwork,
        durationSeconds=max(1, int(item.get("duration_ms") or 0) // 1000),
        streamUrl=preview if isinstance(preview, str) else None,
        attribution="Spotify catalog metadata. Playback requires an authorized Spotify user playback session.",
        playable=isinstance(preview, str),
        playbackKind="preview" if isinstance(preview, str) else "metadata",
    )


async def _spotify(query: str, limit: int) -> list[ProviderTrack]:
    token = await _spotify_token()
    if not token:
        return []

    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=True) as client:
            response = await client.get(
                SPOTIFY_SEARCH_URL,
                headers={"Authorization": f"Bearer {token}"},
                params={"q": query, "type": "track", "limit": limit, "market": "IN"},
            )
        response.raise_for_status()
    except httpx.HTTPError:
        return []

    items = response.json().get("tracks", {}).get("items", [])
    return [track for item in items if isinstance(item, dict) and (track := _spotify_track(item))]


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
    spotify_tracks = await _spotify(q, limit)
    for track in spotify_tracks:
        found.setdefault(track.id, track)
        if len(found) >= limit:
            break

    for term in _terms(q):
        for country in ("IN", "US", "GB"):
            if len(found) >= limit:
                break
            tracks = await _itunes({"term": term, "media": "music", "entity": "song", "limit": limit, "country": country})
            for track in tracks:
                found.setdefault(track.id, track)
                if len(found) >= limit:
                    break
    spotify_configured = bool(get_settings().spotify_client_id and get_settings().spotify_client_secret)
    attribution = (
        "Spotify catalog metadata plus authorized iTunes previews. Full-track playback requires user-authorized provider playback."
        if spotify_configured
        else "Authorized 30-second previews provided by the iTunes Search API. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET for Spotify catalog metadata."
    )
    return MusicSearchResponse(providerConfigured=True, tracks=list(found.values()), attribution=attribution)


@router.get("/resolve/{provider}/{track_id}", response_model=ProviderTrack)
async def resolve_track(provider: str, track_id: str) -> ProviderTrack:
    if provider == "spotify-catalog":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Spotify catalog tracks need a user-authorized playback session; MelodyDesk does not proxy copyrighted audio.",
        )
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
