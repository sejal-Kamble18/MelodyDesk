import { SectionHeader } from '../components/product/SectionHeader';
import { Button } from '../components/ui/Button';
import { useSessionStore } from '../store/sessionStore';
import type { Preferences } from '../types/product';

const numberFields: Array<{ key: keyof Preferences; label: string; min: number; max: number }> = [
  { key: 'focusMinutes', label: 'Focus minutes', min: 1, max: 180 },
  { key: 'shortBreakMinutes', label: 'Short break', min: 1, max: 60 },
  { key: 'longBreakMinutes', label: 'Long break', min: 1, max: 90 },
  { key: 'longBreakInterval', label: 'Long break interval', min: 2, max: 8 },
];

const toggleFields: Array<{ key: keyof Preferences; label: string; detail: string }> = [
  { key: 'autoStartBreaks', label: 'Auto-start breaks', detail: 'Move from focus into break without another click.' },
  { key: 'autoStartFocus', label: 'Auto-start focus', detail: 'Resume focus automatically when a break ends.' },
  { key: 'notificationsEnabled', label: 'Notifications', detail: 'Surface timer and completion reminders.' },
  { key: 'sessionEndSoundEnabled', label: 'Completion sound', detail: 'Play a native cue when a session ends.' },
  { key: 'reducedMotion', label: 'Reduced motion', detail: 'Limit animated UI transitions.' },
];

export const SettingsPage = () => {
  const { preferences, updatePreferences, spotifyConnected, spotifyPremium, toggleSpotifyConnection, toggleSpotifyPremium } = useSessionStore();

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Settings"
        title="Timer and playback preferences"
        description="These controls map to the preferences table from the Notion architecture and persist locally until the API is connected."
        action={<span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-zinc-300">Saved locally</span>}
      />

      <section className="rounded-lg border border-white/10 bg-[#181818] p-5">
        <h2 className="text-xl font-bold text-white">Pomodoro timing</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {numberFields.map((field) => (
            <label key={field.key} className="rounded-md bg-black/35 p-4">
              <span className="text-sm font-medium text-slate-300">{field.label}</span>
              <input
                aria-label={field.label}
                className="mt-4 h-1 w-full accent-[#1ed760]"
                max={field.max}
                min={field.min}
                onChange={(event) => updatePreferences({ [field.key]: Number(event.target.value) } as Partial<Preferences>)}
                type="range"
                value={preferences[field.key] as number}
              />
              <span className="mt-2 block text-sm text-slate-400">{preferences[field.key] as number}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-[#181818] p-5">
        <h2 className="text-xl font-bold text-white">Behavior</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {toggleFields.map((field) => (
            <label key={field.key} className="flex items-center justify-between gap-4 rounded-md bg-black/35 p-4">
              <span>
                <span className="block font-bold text-white">{field.label}</span>
                <span className="mt-1 block text-sm text-slate-400">{field.detail}</span>
              </span>
              <input
                aria-label={field.label}
                checked={Boolean(preferences[field.key])}
                className="h-5 w-5 accent-[#1ed760]"
                onChange={(event) => updatePreferences({ [field.key]: event.target.checked } as Partial<Preferences>)}
                type="checkbox"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-white/8 bg-[#111113] p-5">
        <h2 className="text-xl font-black text-white">Connected Music Services</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Spotify OAuth should be handled by the FastAPI backend. MelodyDesk stores provider references and playback-safe status only.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ['Spotify connection', spotifyConnected ? 'Connected' : 'Disconnected'],
            ['Playback eligibility', spotifyPremium ? 'Premium ready' : 'Premium required'],
            ['Stored content', 'References only'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[18px] bg-white/[0.05] p-4">
              <p className="text-sm text-zinc-400">{label}</p>
              <p className="mt-1 font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={toggleSpotifyConnection} variant={spotifyConnected ? 'secondary' : 'primary'}>
            {spotifyConnected ? 'Disconnect Spotify' : 'Connect Spotify'}
          </Button>
          <Button onClick={toggleSpotifyPremium} variant="secondary">
            {spotifyPremium ? 'Disable Premium state' : 'Enable Premium state'}
          </Button>
        </div>
      </section>
    </div>
  );
};
