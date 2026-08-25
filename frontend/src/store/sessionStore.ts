import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultPreferences, sessions } from '../data/melodydesk';
import type { ActivityId, FocusSession, MusicSource, Preferences, SessionMode } from '../types/product';

export type SessionDraft = {
  title: string;
  activity: ActivityId;
  customActivityName: string;
  mode: SessionMode;
  musicSource: MusicSource;
  playlistName: string;
  customMinutes: number;
};

export type ActiveSession = {
  id: string;
  title: string;
  activity: ActivityId;
  customActivityName?: string;
  mode: SessionMode;
  musicSource: MusicSource;
  playlistName: string;
  phase: 'focus' | 'short-break' | 'long-break' | 'free';
  plannedSeconds: number;
  startedAt: number;
  accumulatedSeconds: number;
  isRunning: boolean;
  cycle: number;
};

interface SessionState {
  draft: SessionDraft;
  activeSession: ActiveSession | null;
  history: FocusSession[];
  preferences: Preferences;
  spotifyConnected: boolean;
  spotifyPremium: boolean;
  setDraft: (draft: Partial<SessionDraft>) => void;
  startSession: () => void;
  pauseSession: (elapsedSeconds: number) => void;
  resumeSession: () => void;
  resetSession: () => void;
  skipPhase: () => void;
  finishSession: (elapsedSeconds: number, status?: FocusSession['status']) => void;
  updatePreferences: (preferences: Partial<Preferences>) => void;
  toggleSpotifyConnection: () => void;
  toggleSpotifyPremium: () => void;
}

const createSessionId = () => `session_${Date.now()}`;

const getPlannedSeconds = (mode: SessionMode, customMinutes: number, preferences: Preferences) => {
  if (mode === 'free') {
    return 0;
  }

  return (mode === 'custom' ? customMinutes : preferences.focusMinutes) * 60;
};

const nextPhase = (session: ActiveSession, preferences: Preferences): Pick<ActiveSession, 'phase' | 'plannedSeconds' | 'cycle'> => {
  if (session.phase === 'focus') {
    const nextCycle = session.cycle + 1;
    const shouldLongBreak = nextCycle % preferences.longBreakInterval === 0;
    return {
      phase: shouldLongBreak ? 'long-break' : 'short-break',
      plannedSeconds: (shouldLongBreak ? preferences.longBreakMinutes : preferences.shortBreakMinutes) * 60,
      cycle: nextCycle,
    };
  }

  return {
    phase: 'focus',
    plannedSeconds: session.mode === 'custom' ? session.plannedSeconds : preferences.focusMinutes * 60,
    cycle: session.cycle,
  };
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      draft: {
        title: 'Deep Work Session',
        activity: defaultPreferences.defaultActivity,
        customActivityName: '',
        mode: defaultPreferences.defaultMode,
        musicSource: defaultPreferences.preferredMusicSource,
        playlistName: 'Deep Code Current',
        customMinutes: 45,
      },
      activeSession: null,
      history: sessions,
      preferences: defaultPreferences,
      spotifyConnected: false,
      spotifyPremium: false,
      setDraft: (draft) => set((state) => ({ draft: { ...state.draft, ...draft } })),
      startSession: () => {
        const { draft, preferences } = get();
        const plannedSeconds = getPlannedSeconds(draft.mode, draft.customMinutes, preferences);
        set({
          activeSession: {
            id: createSessionId(),
            title: draft.title.trim() || 'Focus Session',
            activity: draft.activity,
            customActivityName: draft.activity === 'custom' ? draft.customActivityName?.trim() : undefined,
            mode: draft.mode,
            musicSource: draft.musicSource,
            playlistName: draft.playlistName,
            phase: draft.mode === 'free' ? 'free' : 'focus',
            plannedSeconds,
            startedAt: Date.now(),
            accumulatedSeconds: 0,
            isRunning: true,
            cycle: 1,
          },
        });
      },
      pauseSession: (elapsedSeconds) => {
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, accumulatedSeconds: elapsedSeconds, isRunning: false }
            : null,
        }));
      },
      resumeSession: () => {
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, startedAt: Date.now(), isRunning: true }
            : null,
        }));
      },
      resetSession: () => {
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, startedAt: Date.now(), accumulatedSeconds: 0, isRunning: false }
            : null,
        }));
      },
      skipPhase: () => {
        const { activeSession, preferences } = get();
        if (!activeSession || activeSession.mode === 'free') {
          return;
        }

        const phase = nextPhase(activeSession, preferences);
        set({
          activeSession: {
            ...activeSession,
            ...phase,
            startedAt: Date.now(),
            accumulatedSeconds: 0,
            isRunning: activeSession.phase === 'focus' ? preferences.autoStartBreaks : preferences.autoStartFocus,
          },
        });
      },
      finishSession: (elapsedSeconds, status = 'completed') => {
        const { activeSession, history } = get();
        if (!activeSession) {
          return;
        }

        const completedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
        const session: FocusSession = {
          id: activeSession.id,
          title: activeSession.title,
          activity: activeSession.activity,
          customActivityName: activeSession.customActivityName,
          mode: activeSession.mode,
          musicSource: activeSession.musicSource,
          playlistName: activeSession.playlistName,
          plannedMinutes: Math.max(1, Math.round(activeSession.plannedSeconds / 60) || completedMinutes),
          completedMinutes,
          status,
          completedAt: 'Today',
        };

        set({ activeSession: null, history: [session, ...history] });
      },
      updatePreferences: (preferences) => {
        set((state) => ({ preferences: { ...state.preferences, ...preferences } }));
      },
      toggleSpotifyConnection: () => set((state) => ({ spotifyConnected: !state.spotifyConnected })),
      toggleSpotifyPremium: () => set((state) => ({ spotifyPremium: !state.spotifyPremium })),
    }),
    {
      name: 'melodydesk-session',
      partialize: (state) => ({
        draft: state.draft,
        activeSession: state.activeSession,
        history: state.history,
        preferences: state.preferences,
        spotifyConnected: state.spotifyConnected,
        spotifyPremium: state.spotifyPremium,
      }),
    },
  ),
);
