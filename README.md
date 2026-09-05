# 🎵 MelodyDesk

> **Music for focused moments.**

MelodyDesk is an AI-powered focus, study, and music workspace designed for students, developers, creators, and professionals who want to stay productive without constantly switching between multiple applications.

It combines **focus sessions, Pomodoro timers, music discovery, AI-powered recommendations, productivity tracking, favorites, and collaborative study rooms** into a single productivity-focused workspace.

---

## 🚀 Project Overview

| | |
|---|---|
| **Project Name** | MelodyDesk |
| **Project Type** | Capstone |
| **Track** | Frontend AI Engineering |
| **Program** | FlyRank Internship |
| **Week** | Week 8 |
| **Category** | AI-Enhanced Productivity Application |
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand |
| **Backend** | FastAPI, Python |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth |
| **Realtime** | Supabase Realtime |
| **AI** | OpenAI API |
| **Music APIs** | Spotify Web API, iTunes Preview API |

---

## 🎯 Project Brief

MelodyDesk solves the problem of switching between separate applications for productivity, focus timers, music, and collaborative study. It is built for students, developers, creators, and professionals who want a single workspace for focused work. I chose this idea because music and structured focus sessions are already part of many people's productivity routines, but these experiences are usually fragmented across different applications. MelodyDesk combines them while using AI to personalize the music experience based on the user's activity, mood, session duration, and preferred genres.

---

## 🌐 Live Demo

**Production Application:**  
`https://melodydesk.vercel.app`

**GitHub Repository:**  
`https://github.com/sejal-Kamble18/MelodyDesk`

---

# ✨ Features

## 🎯 Focus Sessions

MelodyDesk provides multiple focus modes for different productivity styles.

### Supported Modes

- 🍅 Pomodoro
- ⏱️ Custom duration
- ♾️ Free focus
- ▶️ Pause and resume
- ⏹️ Finish session early
- ☕ Focus and break phases
- 🎯 Activity selection
- 📝 Session notes
- 📚 Session history

### Timestamp-Based Timer

The timer uses timestamp-based state rather than relying exclusively on decrementing a counter.
Instead of depending only on:  
```
Session Start Timestamp
        +
Current Timestamp
        ↓
Elapsed Time
        ↓
Current Session State

remainingSeconds--
```

This approach helps maintain more accurate elapsed time when:
- The browser tab becomes inactive
- Background JavaScript execution is throttled
- The user switches applications
- The browser temporarily reduces timer execution

## 🔄 AI Workflow
                    ┌──────────────────┐
                    │    Focus Setup   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
          Activity          Mood        Duration
              │              │              │
              └──────────────┼──────────────┘
                             │
                      Preferred Genres
                             │
                             ▼
                   ┌─────────────────┐
                   │   AI Focus DJ   │
                   └────────┬────────┘
                            │
                            ▼
                ┌─────────────────────┐
                │ Recommendation /    │
                │ Music Search Query  │
                └──────────┬──────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │ Music Search │
                   └──────┬───────┘
                          │
                          ▼
                  🎧 Focus Experience

## 🧩 AI Architecture
AI operations are handled by the FastAPI backend rather than directly from the browser.
```
┌───────────────┐
│   Frontend    │
│ React + TS    │
└───────┬───────┘
        │
        │ Focus Context
        ▼
┌──────────────────┐
│ FastAPI Backend  │
└────────┬─────────┘
         │
         │ AI Request
         ▼
┌──────────────────┐
│    OpenAI API    │
└────────┬─────────┘
         │
         │ Recommendation
         ▼
┌──────────────────┐
│ Music Search     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Focus Session    │
└──────────────────┘
```
## 🎧 Music Discovery
MelodyDesk integrates music discovery directly into the focus experience.
Users can:
- 🔎 Search for tracks
- 🎤 Search for artists
- 🎵 View track metadata
- 🎧 Listen to available previews
- ❤️ Save favorite tracks
- 🎼 Discover music by genre
- 🤖 Search using AI-generated queries
Example searches: Taylor Swift, Shakira, Arijit Singh, Motivation

## 🎵 Music Provider Architecture
MelodyDesk separates catalog metadata, preview audio, and full-track playback.

                Music Search
                     │
                     ▼
             ┌───────────────┐
             │ Music Provider│
             └───────┬───────┘
                     │
            ┌────────┴────────┐
            │                 │
            ▼                 ▼
     Track Metadata      Preview URL
            │                 │
            ▼                 ▼
      Track Display      Preview Player

Full-track playback requires an authorized playback session supported by the selected music provider.
MelodyDesk does not:
- Scrape copyrighted audio
- Proxy copyrighted audio
- Fabricate audio URLs
- Represent previews as full tracks
iTunes preview URLs are treated as preview audio only.

## 👥 Collaborative Study Rooms
MelodyDesk provides collaborative study rooms using Supabase Realtime.
Users can:
- ➕ Create study rooms
- 🔑 Join rooms using a code
- 👥 Study with other users
- 🚦 Manage room capacity
- 🔄 Receive realtime membership updates
- 🚪 Leave rooms

## Study Room Flow
                    ┌───────────┐
                    │   User A  │
                    └─────┬─────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Create Room   │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   Room Code   │
                  └───────┬───────┘
                          │
                    ┌─────┴─────┐
                    │           │
                    ▼           ▼
                ┌───────┐   ┌───────┐
                │ User B│   │ User C│
                └───┬───┘   └───┬───┘
                    │           │
                    └─────┬─────┘
                          ▼
                 Supabase Realtime
                          │
                          ▼
                Synchronized Members

## 📊 Productivity Tracking
MelodyDesk stores focus activity to provide users with a history of their productivity.
Tracked information can include:
- Focus sessions
- Session duration
- Activities
- Completed sessions
- Session history
- Goals
- Favorite tracks
This data provides a foundation for future productivity analytics and personalized AI recommendations.

## 🔐 Authentication
MelodyDesk uses Supabase Auth for user authentication.
Supported flows include:
- 📝 Registration
- ✉️ Email verification
- 🔑 Login
- 🔄 Session restoration
- 🔐 Password reset
- 🚪 Logout
User-specific data is protected through authentication and PostgreSQL Row Level Security.

## 🏗️ System Architecture
                         ┌───────────────────────┐
                         │       MelodyDesk      │
                         └───────────┬───────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
           ┌─────────────────┐              ┌─────────────────┐
           │  Web Frontend   │              │ FastAPI Backend │
           │                 │              │                 │
           │ React           │              │ Python          │
           │ TypeScript      │              │ FastAPI         │
           │ Vite            │              │ AI Operations   │
           │ Tailwind CSS    │              │ Music APIs      │
           │ Zustand         │              │                 │
           └────────┬────────┘              └────────┬────────┘
                    │                                │
        ┌───────────┼────────────┐           ┌───────┴────────┐
        │           │            │           │                │
        ▼           ▼            ▼           ▼                ▼
      Auth        Focus        Music       OpenAI         Music APIs
        │           │            │           │                │
        └───────────┴────────────┴───────────┴────────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Supabase   │
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
                  Auth          PostgreSQL         Realtime
                                   │
                                   ▼
                                  RLS

## 🧩 Architecture Responsibilities
| Layer | Responsibility |
|---|---|
| React | User interface |
| TypeScript | Type-safe application development |
| Vite | Frontend development and production builds |
| Tailwind CSS | Styling and responsive UI |
| Zustand | Client-side state management |
| React Router | Application routing |
| FastAPI | Backend API and server-side operations |
| OpenAI | AI Focus DJ |
| Spotify API | Music catalog metadata |
| iTunes | Preview audio |
| Supabase Auth | Authentication |
| PostgreSQL | Persistent data |
| RLS | Database authorization |
| Supabase Realtime | Study-room synchronization |

## 🛠️ Tech Stack

| Category                  | Technologies                                                                 |
|---------------------------|-------------------------------------------------------------------------------|
| **Frontend**              | React · TypeScript · Vite · Tailwind CSS · Zustand · React Router             |
| **Backend**               | Python · FastAPI · Uvicorn                                                    |
| **Database & Services**   | Supabase · PostgreSQL · Supabase Auth · Row Level Security · RPC Functions · Supabase Realtime |
| **AI**                    | OpenAI API · LLM-powered recommendation workflow                             |
| **Music APIs**            | Spotify Web API · iTunes Preview API                                          |
| **Development & Testing** | Git · GitHub · npm · pip · ESLint · pytest · Lighthouse · axe DevTools · WAVE |

## ⚙️ Environment Variables

MelodyDesk separates public frontend configuration from sensitive backend credentials.

### 🌐 Frontend
Create: `frontend/.env`

Add:

| Variable                   | Description                |
|----------------------------|----------------------------|
| `VITE_SUPABASE_URL`        | Supabase project URL       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable Supabase key |
| `VITE_API_BASE_URL`        | FastAPI backend URL        |

> ✅ Only publishable Supabase credentials should be exposed to the frontend.

---

### 🔒 Backend
Create: `backend/.env`

Add:

| Variable            | Description                          |
|---------------------|--------------------------------------|
| `PROJECT_NAME`      | Application name                     |
| `ENVIRONMENT`       | Runtime environment                  |
| `API_V1_PREFIX`     | API prefix                           |
| `BACKEND_URL`       | Backend URL                          |
| `FRONTEND_URL`      | Frontend URL                         |
| `CORS_ORIGINS`      | Allowed frontend origins             |
| `OPENAI_API_KEY`    | OpenAI API credential                |
| `OPENAI_MODEL`      | OpenAI model                         |
| `OPENAI_BASE_URL`   | Optional OpenAI-compatible API URL   |
| `SPOTIFY_CLIENT_ID` | Spotify application client ID        |
| `SPOTIFY_CLIENT_SECRET` | Spotify application secret       |

---

⚠️ **Never commit `.env` files or private credentials to the repository.**

## 💻 Local Development

### Prerequisites
- Node.js, npm  
- Python 3.x  
- Git  
- Supabase project  

### Setup

# Clone repo
```
git clone <YOUR_REPOSITORY_URL>
cd MelodyDesk
```
# Backend
```
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```
# Frontend (new terminal)
```
cd frontend
npm install
npm run dev
```
# Supabase
Apply migrations in supabase/migrations before testing:
```
 Auth · Sessions · Favorites · Study rooms · Realtime
```
## 🔐 Security
The application separates public client configuration from private server credentials.
Frontend-Safe Values
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_API_BASE_URL
```
Server-Only Secrets
```
OPENAI_API_KEY
SPOTIFY_CLIENT_SECRET
```
Private credentials must never be:
- Committed to Git
- Included in frontend source code
- Stored in public environment files
- Exposed through browser-side requests

## 🗄️ Database & Data Security
Supabase PostgreSQL provides persistent storage for application data.
The database supports:
- User data
- Focus sessions
- Session history
- Favorites
- Study rooms
- Room membership
- User preferences

Access is protected through:
```
Supabase Authentication
          ↓
     PostgreSQL
          ↓
Row Level Security
          ↓
Authorized Data Access
```
## 🔄 Realtime
Supabase Realtime is used for collaborative study-room updates.
```
User A
  │
  ▼
Database Change
  │
  ▼
Supabase Realtime
  │
  ├──────────────┐
  ▼              ▼
User B          User C
```
This allows relevant room membership changes to synchronize without requiring users to manually refresh the application.

## 🚀 Deployment
MelodyDesk uses a separated frontend/backend deployment architecture.

                         Production
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
           Frontend                    Backend
           Vite App                   FastAPI
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
                          Supabase
                             │
                   ┌─────────┼─────────┐
                   ▼         ▼         ▼
                Auth    PostgreSQL  Realtime

## 🔁 Rollback Plan
The deployment strategy keeps rollback simple and intentional.
If a production deployment introduces a critical regression:
```
Identify Issue
      ↓
Stop Further Changes
      ↓
Identify Last Known-Good Commit
      ↓
Revert / Redeploy
      ↓
Run Smoke Tests
      ↓
Verify Production
```
## 🔮 Future Improvements

### 🤖 AI
- Personalized recommendations
- Adaptive music suggestions
- Long-term preference learning
- Context-aware focus plans
- Productivity insights

### 🎧 Music
- Spotify playback (user-authorized)
- Apple Music integration
- Licensed providers
- Personalized playlists
- Better discovery

### 👥 Collaboration
- Richer room presence
- Shared timers & progress
- Collaborative goals
- Realtime chat

### 📊 Analytics
- Weekly & monthly reports
- Focus streaks & trends
- Session comparisons
- AI-powered insights

### 🌐 Platform
- Chrome extension
- Mobile app
- Push notifications
- Cross-device sync

### 🧪 Testing
- End-to-end suite
- Auth flow tests
- Realtime study-room tests
- AI failure-state checks
- Music provider integration
- Accessibility automation
- CI checks
- 
## 🎓 FlyRank Capstone

MelodyDesk was developed as the **Week 8 Capstone Project** for the FlyRank Frontend AI Engineering track.  
The objective was to demonstrate the ability to **build, test, document, and deploy** a production-ready AI‑enhanced frontend application.

### 🔑 Key Focus Areas
- Accessible components  
- AI integration in workflows  
- Resilience & error handling  
- Testing & performance  
- Accessibility auditing  
- Deployment & production documentation  

> 🎯 The goal was not just to add an AI feature, but to **integrate AI meaningfully into the product workflow**.


## 📄 License

This project is intended for **educational, portfolio, and demonstration purposes**.  
Third-party APIs, music metadata, preview audio, trademarks, artwork, and other external resources remain subject to their respective providers' terms, licenses, and policies.

<br>

<div align="center">

🎵 **MelodyDesk**  
Music for focused moments.  
Built with ❤️ for better focus and fewer distractions.  

</div>
