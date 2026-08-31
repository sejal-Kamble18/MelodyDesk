# MelodyDesk Backend

Small FastAPI service for server-only MelodyDesk work: health checks, AI Focus DJ, and provider-backed music search.

Supabase owns authentication, user identity, Postgres tables, and RLS. This backend does not manage passwords, browser auth sessions, or a local database.

## Structure

- `app/main.py`: app factory, CORS, routers
- `app/core/config.py`: environment settings
- `app/api/routes/health.py`: health endpoint
- `app/api/routes/music.py`: Spotify catalog metadata and iTunes preview search
- `app/api/routes/ai.py`: Focus DJ recommendation endpoint

## Setup

```powershell
python -m pip install -r requirements.txt
```

Required:

```text
PROJECT_NAME
ENVIRONMENT
API_V1_PREFIX
BACKEND_URL
FRONTEND_URL
CORS_ORIGINS
OPENAI_API_KEY
OPENAI_MODEL
OPENAI_BASE_URL
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
```

AI Focus DJ uses `OPENAI_API_KEY` when present and otherwise returns a deterministic local recommendation. Spotify credentials enable real catalog metadata search. iTunes preview URLs are returned only as legal previews, not full tracks.

## Run

```powershell
uvicorn app.main:app --reload
```

Useful URLs:

```text
API: http://127.0.0.1:8000
Swagger: http://127.0.0.1:8000/docs
Health: http://127.0.0.1:8000/api/v1/health
```

## Test

```powershell
python -m compileall app
python -m pytest -q
```
