import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { activities, playlists } from '../../data/melodydesk';
import { getFocusDjRecommendation, type FocusDjRecommendation } from '../../services/aiService';
import { useSessionStore } from '../../store/sessionStore';
import type { MusicSource, SessionMode } from '../../types/product';
import { ActivityCard } from './ActivityCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const modes: Array<{ id: SessionMode; label: string; description: string }> = [
  { id: 'pomodoro', label: 'Pomodoro', description: 'Focus and break cycles' },
  { id: 'custom', label: 'Custom timer', description: '1 to 180 minute blocks' },
  { id: 'free', label: 'Free listening', description: 'Elapsed time only' },
];

const musicSources: Array<{ id: MusicSource; label: string; description: string }> = [
  { id: 'spotify', label: 'Music service', description: 'Authorized external catalog' },
  { id: 'focus-sound', label: 'Focus sounds', description: 'Native copyright-free fallback' },
  { id: 'silent', label: 'No music', description: 'Timer without audio' },
];

export const SessionSetup = () => {
  const navigate = useNavigate();
  const { draft, setDraft, startSession } = useSessionStore();
  const [mood, setMood] = useState('focused');
  const [recommendation, setRecommendation] = useState<FocusDjRecommendation | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const selectedActivity = useMemo(() => activities.find((activity) => activity.id === draft.activity) ?? activities[0], [draft.activity]);
  const durationMinutes = draft.mode === 'free' ? 60 : draft.mode === 'custom' ? draft.customMinutes : 25;

  const handleStart = () => {
    startSession();
    navigate('/focus/active');
  };

  const askFocusDj = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const next = await getFocusDjRecommendation({
        activity: draft.activity === 'custom' ? draft.customActivityName || 'custom focus' : selectedActivity.name,
        mood,
        duration_minutes: durationMinutes,
        preferred_genres: selectedActivity.genres,
      });
      setRecommendation(next);
      setDraft({ playlistName: next.query, musicSource: 'spotify' });
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Focus DJ is unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-6">
        <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
          <h2 className="text-xl font-bold text-white">Activity</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                selected={draft.activity === activity.id}
                onSelect={() => setDraft({ activity: activity.id })}
              />
            ))}
          </div>
          {draft.activity === 'custom' ? (
            <div className="mt-4 max-w-md">
              <Input
                label="Custom activity name"
                placeholder="Writing thesis, cleaning desk, client work"
                value={draft.customActivityName ?? ''}
                onChange={(event) => setDraft({ customActivityName: event.target.value })}
              />
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
          <h2 className="text-xl font-bold text-white">Session mode</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setDraft({ mode: mode.id })}
                className={`rounded-lg border p-4 text-left transition ${draft.mode === mode.id ? 'border-[#1ed760]/70 bg-[#1ed760]/12' : 'border-white/10 bg-black/30 hover:bg-white/8'}`}
              >
                <span className="text-base font-bold text-white">{mode.label}</span>
                <span className="mt-1 block text-sm text-slate-400">{mode.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
          <h2 className="text-xl font-bold text-white">Music source</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {musicSources.map((source) => (
              <button
                key={source.id}
                type="button"
                onClick={() => setDraft({ musicSource: source.id })}
                className={`rounded-lg border p-4 text-left transition ${draft.musicSource === source.id ? 'border-[#1ed760]/70 bg-[#1ed760]/12' : 'border-white/10 bg-black/30 hover:bg-white/8'}`}
              >
                <span className="text-base font-bold text-white">{source.label}</span>
                <span className="mt-1 block text-sm text-slate-400">{source.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
        <h2 className="text-xl font-bold text-white">Session summary</h2>
        <div className="mt-5 space-y-4">
          <Input label="Session title" value={draft.title} onChange={(event) => setDraft({ title: event.target.value })} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Custom duration</span>
            <input
              aria-label="Custom duration minutes"
              className="h-1 w-full accent-[#1ed760]"
              max="180"
              min="1"
              onChange={(event) => setDraft({ customMinutes: Number(event.target.value) })}
              type="range"
              value={draft.customMinutes}
            />
            <span className="mt-2 block text-sm text-slate-400">{draft.customMinutes} minutes</span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Playlist, sound, or provider query</span>
            <input
              className="h-12 w-full rounded-md border border-white/10 bg-[#121212] px-4 text-sm text-white outline-none focus:border-[#1ed760]/70"
              list="melodydesk-playlists"
              onChange={(event) => setDraft({ playlistName: event.target.value })}
              value={draft.playlistName}
            />
            <datalist id="melodydesk-playlists">
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.title} />
              ))}
            </datalist>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Mood</span>
            <input
              className="h-12 w-full rounded-md border border-white/10 bg-[#121212] px-4 text-sm text-white outline-none focus:border-[#1ed760]/70"
              onChange={(event) => setMood(event.target.value)}
              placeholder="focused, calm, tired, energized"
              value={mood}
            />
          </label>
          <Button className="w-full" disabled={aiLoading} onClick={() => void askFocusDj()} type="button" variant="secondary">
            <Sparkles size={17} /> {aiLoading ? 'Tuning...' : 'Ask Focus DJ'}
          </Button>
          {recommendation ? (
            <div className="rounded-lg border border-[#1ed760]/20 bg-[#1ed760]/10 p-4 text-sm text-slate-200">
              <p className="font-bold text-white">{recommendation.query}</p>
              <p className="mt-1 text-slate-300">Energy: {recommendation.energy}</p>
              <p className="mt-2 text-slate-400">{recommendation.reason}</p>
            </div>
          ) : null}
          {aiError ? <p className="text-sm text-rose-300">{aiError}</p> : null}
          <div className="rounded-lg bg-black/35 p-4 text-sm text-slate-300">
            External catalog content is represented through provider references only. Native sounds remain available when no music service is connected.
          </div>
          <Button className="w-full" onClick={handleStart} size="lg">
            Start session
          </Button>
        </div>
      </div>
    </div>
  );
};
