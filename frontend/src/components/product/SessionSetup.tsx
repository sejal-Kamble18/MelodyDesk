import { useNavigate } from 'react-router-dom';
import { activities, playlists } from '../../data/melodydesk';
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

  const handleStart = () => {
    startSession();
    navigate('/focus/active');
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
            <span className="mb-2 block text-sm font-medium text-slate-300">Playlist or sound</span>
            <select
              className="h-12 w-full rounded-md border border-white/10 bg-[#121212] px-4 text-sm text-white outline-none focus:border-[#1ed760]/70"
              onChange={(event) => setDraft({ playlistName: event.target.value })}
              value={draft.playlistName}
            >
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.title}>
                  {playlist.title}
                </option>
              ))}
            </select>
          </label>
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
