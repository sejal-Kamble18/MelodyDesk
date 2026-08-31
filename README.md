# MelodyDesk 🎵

> **Music for focused moments.**

MelodyDesk is an AI-powered focus, study, and music workspace designed for students, developers, creators, and anyone who wants to stay productive without constantly switching between productivity and music applications.

It combines customizable focus sessions, Pomodoro timers, music discovery, AI-powered focus recommendations, productivity analytics, and collaborative study rooms in one workspace.

---

## ✨ What is MelodyDesk?

MelodyDesk solves a simple problem:

> **People often switch between multiple apps while trying to focus.**

A user may need one application for a timer, another for music, another for productivity tracking, and another for studying with friends.

MelodyDesk brings these experiences together in one focused workspace.

Users can:

- Start a Pomodoro or custom focus session
- Run free-focus sessions
- Search and explore music
- Get AI-powered music recommendations
- Track focus history and productivity
- Create or join study rooms
- Study with friends in real time
- Save favorite tracks
- Manage personal preferences
- Continue sessions across devices through cloud-backed data

---

# 🚀 Features

## 🎯 Focus Sessions

MelodyDesk supports multiple focus modes:

- Pomodoro
- Custom duration
- Free focus
- Pause and resume
- Finish early
- Focus and break phases
- Session activity selection
- Session notes
- Session history

The timer is designed around timestamp-based state rather than relying only on decrementing counters, which helps keep elapsed time accurate when the browser is throttled or temporarily inactive.

---

## 🤖 AI Focus DJ

The **AI Focus DJ** is MelodyDesk's main AI capability.

Instead of adding a generic chatbot, the AI is directly connected to the productivity workflow.

The user provides information such as:

- Activity
- Mood
- Session duration
- Preferred genres

Example:
Activity: Coding
Mood: Tired
Duration: 60 minutes
Preferred genres: Ambient, Electronic

## Architecture

- Frontend: React, TypeScript, Vite, Tailwind, Zustand, React Router.
- Backend: FastAPI for server-only AI and music operations.
- Data: Supabase Auth, Postgres, RLS policies, RPC functions, and Realtime.

                           MelodyDesk
                               │
                  ┌────────────┴────────────┐
                  │                         │
             Web Frontend              FastAPI Backend
                  │                         │
        ┌─────────┼─────────┐        ┌──────┴───────┐
        │         │         │        │              │
      Auth      Focus     Music     AI         Music APIs
        │         │         │        │              │
        └─────────┴─────────┴────────┴──────────────┘
                               │
                            Supabase
                               │
                ┌──────────────┼──────────────┐
                │              │              │
               Auth        PostgreSQL       Realtime
                              + RLS

          
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

## Environment Setup

VITE_SUPABASE_URL=

VITE_SUPABASE_PUBLISHABLE_KEY=

VITE_API_BASE_URL=


## Future

- richer licensed music providers
- Chrome extension
- advanced room collaboration
- personalized AI recommendations


_This is Capstone Project for FlyRank_
