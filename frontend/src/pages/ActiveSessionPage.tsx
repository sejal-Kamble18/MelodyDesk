import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProgressBar } from '../components/product/ProgressBar';
import { SectionHeader } from '../components/product/SectionHeader';
import { Button } from '../components/ui/Button';
import { activities } from '../data/melodydesk';
import { formatTime, useSessionTimer } from '../hooks/useSessionTimer';
import { useSessionStore } from '../store/sessionStore';

export const ActiveSessionPage = () => {
  const navigate = useNavigate();
  const { activeSession, pauseSession, resumeSession, resetSession, skipPhase, finishSession } = useSessionStore();
  const timer = useSessionTimer(activeSession);
  const activity = activities.find((item) => item.id === activeSession?.activity);
  const [notes, setNotes] = useState('');
  const [distractionFree, setDistractionFree] = useState(false);

  useEffect(() => {
    if (activeSession && activeSession.mode !== 'free' && timer.remainingSeconds === 0 && timer.elapsedSeconds > 0) {
      finishSession(timer.elapsedSeconds);
      navigate('/analytics');
    }
  }, [activeSession, finishSession, navigate, timer.elapsedSeconds, timer.remainingSeconds]);

  if (!activeSession) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Active session"
          title="No session is running"
          description="Start a session to see timer controls, cycle state, playback recovery, and completion behavior."
        />
        <Button>
          <Link to="/focus">Create session</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Active session"
        title={activeSession.title}
        description={`${activeSession.customActivityName || activity?.name || 'Focus'} | ${activeSession.playlistName} | Cycle ${activeSession.cycle}`}
      />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1ed760]">{activeSession.phase.replace('-', ' ')}</p>
              <p className="mt-6 text-7xl font-black leading-none text-white sm:text-8xl">{timer.label}</p>
              <p className="mt-4 text-sm text-slate-400">
                Elapsed {formatTime(timer.elapsedSeconds)} {activeSession.mode !== 'free' ? `| Planned ${formatTime(activeSession.plannedSeconds)}` : ''}
              </p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-md bg-black text-sm font-black text-[#1ed760]">
              {activity?.icon ?? 'MD'}
            </span>
          </div>

          <ProgressBar value={timer.progress * 100} className="mt-10 h-3" />

          <div className="mt-8 flex flex-wrap gap-3">
            {activeSession.isRunning ? (
              <Button onClick={() => pauseSession(timer.elapsedSeconds)} variant="secondary">
                Pause
              </Button>
            ) : (
              <Button onClick={resumeSession}>Resume</Button>
            )}
            <Button onClick={resetSession} variant="ghost">
              Reset
            </Button>
            {activeSession.mode !== 'free' ? (
              <Button onClick={skipPhase} variant="ghost">
                Skip phase
              </Button>
            ) : null}
            <Button
              onClick={() => {
                if (window.confirm('End this focus session and save the current progress?')) {
                  finishSession(timer.elapsedSeconds, 'finished-early');
                }
              }}
              variant="danger"
            >
              Finish early
            </Button>
          </div>
        </div>

        <div className={`space-y-4 ${distractionFree ? 'opacity-60' : ''}`}>
          <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
            <h2 className="text-xl font-bold text-white">Cycle status</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-black/35 p-4">
                <p className="text-sm text-slate-400">Mode</p>
                <p className="mt-1 font-bold capitalize text-white">{activeSession.mode}</p>
              </div>
              <div className="rounded-md bg-black/35 p-4">
                <p className="text-sm text-slate-400">Source</p>
                <p className="mt-1 font-bold capitalize text-white">{activeSession.musicSource === 'spotify' ? 'Music service' : activeSession.musicSource}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-5">
            <h2 className="text-xl font-bold text-amber-100">Safe switching</h2>
            <p className="mt-2 text-sm leading-6 text-amber-100/80">
              Timing changes are kept for the next session by default. Finish early saves partial progress; reset keeps the session local.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-white">Session notes</h2>
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <input className="accent-[#22e26b]" checked={distractionFree} onChange={(event) => setDistractionFree(event.target.checked)} type="checkbox" />
                Distraction-free
              </label>
            </div>
            <textarea
              className="mt-4 min-h-32 w-full rounded-[16px] border border-white/10 bg-white/[0.05] p-4 text-sm text-white outline-none focus:border-[#22e26b]/60"
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Capture task notes, wins, or what to resume next."
              value={notes}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
