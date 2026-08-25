# MelodyDesk Backend

FastAPI backend for MelodyDesk. The current foundation includes health checks, PostgreSQL connectivity, Alembic migrations, user registration, login, JWT access tokens, persisted refresh-token rotation, logout revocation, and OpenAPI docs.

## Architecture

- `app/main.py`: FastAPI app factory, middleware, router registration.
- `app/api/routes`: versioned API routers.
- `app/api/dependencies.py`: request-scoped database and authentication dependencies.
- `app/core`: configuration, logging, security, exception formatting.
- `app/db`: SQLAlchemy engine/session setup and declarative base.
- `app/models`: SQLAlchemy models.
- `app/schemas`: Pydantic request/response schemas.
- `app/services`: business logic and transaction boundaries.
- `migrations`: Alembic environment and revisions.

## Prerequisites

- Python 3.14
- Docker Desktop
- PostgreSQL runs in Docker for local database-backed development and migrations.
- Postman is optional and used after the API endpoints exist.
- pgAdmin is optional and useful for inspecting tables and records.

## Setup

From `backend`:

```powershell
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Update `.env` with local development values. The verified local database URL uses host port `5433`.

Required environment variables:

```text
PROJECT_NAME
ENVIRONMENT
API_V1_PREFIX
BACKEND_URL
FRONTEND_URL
CORS_ORIGINS
DATABASE_URL
JWT_SECRET_KEY
JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS
```

## Database

From the repository root:

```powershell
docker compose up -d
docker compose ps
```

This backend is verified against Docker PostgreSQL exposed on host port `5433`. Do not delete Docker volumes casually. `docker compose down -v` deletes local database data.

Apply migrations from `backend`:

```powershell
alembic upgrade head
alembic current
alembic check
```

pgAdmin local connection values:

```text
Host: 127.0.0.1
Port: 5433
Database: melodydesk
Username: melodydesk
Password: use the local value from backend/.env
```

## Run

From `backend`:

```powershell
uvicorn app.main:app --reload
```

Useful URLs:

```text
API: http://127.0.0.1:8000
Swagger: http://127.0.0.1:8000/docs
OpenAPI: http://127.0.0.1:8000/openapi.json
```

## Test

```powershell
python -m compileall app
pytest -q
alembic current
alembic check
```

## Postman

Import:

- `docs/postman/MelodyDesk_API.postman_collection.json`
- `docs/postman/MelodyDesk_Local.postman_environment.json`

Run `Register`, then `Login`. Successful login stores `access_token` and `refresh_token` collection variables for `Current user`, `Refresh token`, and `Logout`.

## Troubleshooting

- If database health fails, confirm Docker is running and PostgreSQL is reachable on `127.0.0.1:5433`.
- If `127.0.0.1:5432` fails with password errors, another local PostgreSQL service may be occupying that port.
- If migrations fail, verify `DATABASE_URL` in `.env` and run `alembic current`.
- Do not expose `.env` values in logs, tickets, screenshots, or commits.
