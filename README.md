# MelodyDesk

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
