# MelodyDesk Backend

Small FastAPI service for server-only MelodyDesk work: health checks now, music/AI provider secrets later.

Supabase owns authentication, user identity, Postgres tables, and RLS. This backend does not manage passwords, browser auth sessions, or a local database.

## Structure

- `app/main.py`: app factory, CORS, routers
- `app/core/config.py`: environment settings
- `app/api/routes/health.py`: health endpoint
- `app/api/routes/music.py`: iTunes Search API preview provider endpoint
- `app/api/routes/ai.py`: Focus DJ contract endpoint

## Setup

```powershell
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Required:

```text
PROJECT_NAME
ENVIRONMENT
API_V1_PREFIX
BACKEND_URL
FRONTEND_URL
CORS_ORIGINS
```

Music search/playback uses the public iTunes Search API and returns legal 30-second preview URLs. No provider secret is required for the current provider.

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
pytest -q
```
