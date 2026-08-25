import { useEffect, useMemo, useState } from 'react';
import type { ActiveSession } from '../store/sessionStore';

const nowSeconds = () => Math.floor(Date.now() / 1000);

export const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
};

export const useSessionTimer = (session: ActiveSession | null) => {
  const [tick, setTick] = useState(() => nowSeconds());

  useEffect(() => {
    if (!session?.isRunning) {
      return undefined;
    }

    const interval = window.setInterval(() => setTick(nowSeconds()), 500);
    return () => window.clearInterval(interval);
  }, [session?.isRunning]);

  return useMemo(() => {
    if (!session) {
      return {
        elapsedSeconds: 0,
        remainingSeconds: 0,
        progress: 0,
        label: '00:00',
      };
    }

    const liveSeconds = session.isRunning ? Math.max(0, tick - Math.floor(session.startedAt / 1000)) : 0;
    const elapsedSeconds = session.accumulatedSeconds + liveSeconds;
    const remainingSeconds = session.mode === 'free' ? elapsedSeconds : Math.max(0, session.plannedSeconds - elapsedSeconds);
    const progress = session.mode === 'free' ? 1 : Math.min(1, elapsedSeconds / Math.max(1, session.plannedSeconds));

    return {
      elapsedSeconds,
      remainingSeconds,
      progress,
      label: formatTime(session.mode === 'free' ? elapsedSeconds : remainingSeconds),
    };
  }, [session, tick]);
};
