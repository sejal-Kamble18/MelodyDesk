# MelodyDesk

<<<<<<< HEAD
MelodyDesk is an AI-powered focus, study, and music workspace for students and makers who want one place to plan focus blocks, run Pomodoro or free sessions, search music, and work alongside lightweight study rooms.

## Features

- Supabase-only auth: sign up, email verification, login, session restore, logout, and password reset.
- Focus sessions: Pomodoro, custom duration, free focus, pause/resume, finish early, and saved history.
- AI Focus DJ: turns activity, mood, duration, and preferred genres into a provider search query.
- Music provider layer: searches real provider catalogs and only marks tracks playable when an authorized URL is available.
- Study rooms: create by code, join by code, leave, member list, shared focus state, capacity limit, and realtime updates.
- Dashboard, discovery, search, active session, profile, and settings screens.

## Architecture

- Frontend: React, TypeScript, Vite, Tailwind, Zustand, React Router.
- Backend: FastAPI for server-only AI and music operations.
- Data: Supabase Auth, Postgres, RLS policies, RPC functions, and Realtime.

## Environment

Frontend variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_API_BASE_URL
```

Backend variables:

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

Only publishable Supabase credentials belong in the frontend. LLM and music provider secrets stay in the FastAPI environment.

## Local Setup

```powershell
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

```powershell
cd frontend
npm install
npm run dev
```

Apply Supabase migrations in `../supabase/migrations` before testing auth, saved sessions, favorites, or study rooms.

## Provider Notes

AI Focus DJ uses OpenAI when `OPENAI_API_KEY` is configured. Without it, the endpoint returns a deterministic local recommendation so the app flow still works, and the setup gap is explicit.

Spotify client credentials enable real catalog metadata search. Full-track playback still requires a user-authorized provider playback session; MelodyDesk does not scrape, proxy, or fabricate copyrighted audio. iTunes preview URLs are treated as previews only.

## Testing

```powershell
cd frontend
npm run lint
npm run build
```

```powershell
cd backend
python -m compileall app
python -m pytest -q
```

Manual checks:

- Register, verify email, login, restore session, reset password, and logout.
- Create a study room, join by code with another user, confirm capacity and realtime membership updates.
- Search for `Taylor Swift`, `Shakira`, and `Arijit Singh`; confirm metadata-only and preview-only tracks are labeled correctly.
- Ask Focus DJ from the focus setup and confirm the returned query updates the session music target.

## Deployment

Deploy the frontend to a static host that supports Vite builds. Deploy the FastAPI backend separately with server-side env vars. Configure Supabase Auth redirect URLs for the production frontend and run all migrations in order.

## Future Improvements

- Add user-authorized Spotify or Apple Music playback.
- Add richer room presence and shared session progress.
- Add end-to-end tests for auth redirects and study-room realtime behavior.
=======
AI-powered focus workspace for students and professionals.

## Features

- AI Focus DJ
- Pomodoro/custom focus sessions
- Focus music and ambient audio
- Collaborative study rooms
- Productivity analytics
- Goals and history
- Supabase authentication

## Tech Stack

React
TypeScript
Vite
Tailwind CSS
Supabase
FastAPI
LLM API

## Architecture

Frontend
   ↓
Supabase Auth / Database
   ↓
FastAPI
   ↓
AI provider

## AI

AI Focus DJ analyzes:
- activity
- mood
- duration
- preferred genres

and recommends an appropriate focus experience.

## Run

cd frontend
npm install
npm run dev

## Environment

VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_API_BASE_URL=

## Known limitations

Mainstream music providers may expose previews or provider-controlled playback rather than unrestricted full-track streaming.

## Future

- richer licensed music providers
- Chrome extension
- advanced room collaboration
- personalized AI recommendations
>>>>>>> origin/main
