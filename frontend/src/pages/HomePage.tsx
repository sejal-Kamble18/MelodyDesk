import { Link } from 'react-router-dom';
import { Clock3, Flame, Headphones, Play, Sparkles, Timer } from 'lucide-react';
import { HorizontalScroller } from '../components/music/HorizontalScroller';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { Artwork } from '../components/music/Artwork';
import { TrackRow } from '../components/music/TrackRow';
import { ProgressBar } from '../components/product/ProgressBar';
import { Button } from '../components/ui/Button';
import { demoPlaylists, demoTracks } from '../services/musicMock';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import { useSessionStore } from '../store/sessionStore';

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const activeSession = useSessionStore((state) => state.activeSession);
  const { currentTrack, playTrack } = usePlayerStore();
  const heroPlaylist = demoPlaylists[0];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[#111113] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(34,226,107,0.18),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.14),transparent_32%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#22e26b]">
              <Sparkles size={14} /> Music-first focus
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] text-white sm:text-6xl">
              {greeting()}, {user?.name?.split(' ')[0] ?? 'friend'}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              Pick up your listening flow, choose a focus mode, and let MelodyDesk shape the session around the music.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg">
                <Link className="inline-flex items-center gap-2" to="/focus">
                  <Timer size={18} /> Start Focus Session
                </Link>
              </Button>
              <Button size="lg" variant="secondary" onClick={() => playTrack(currentTrack, demoTracks)}>
                <Play size={18} fill="currentColor" /> Continue Listening
              </Button>
              {activeSession ? (
                <Button size="lg" variant="ghost">
                  <Link to="/focus/active">Resume Session</Link>
                </Button>
              ) : null}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/25 p-4 backdrop-blur">
            <Artwork label={currentTrack.artwork} palette={currentTrack.palette} className="aspect-square w-full" />
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Continue listening</p>
              <h2 className="mt-1 text-2xl font-black text-white">{currentTrack.title}</h2>
              <p className="mt-1 text-sm text-zinc-400">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-[22px] border border-white/8 bg-[#111113] p-5">
          <div className="flex items-center gap-3">
            <Clock3 className="text-[#22e26b]" size={22} />
            <h2 className="text-lg font-black text-white">Daily focus goal</h2>
          </div>
          <p className="mt-4 text-3xl font-black text-white">3h 05m</p>
          <ProgressBar value={77} className="mt-4" />
          <p className="mt-3 text-sm text-zinc-400">55 minutes left to close today.</p>
        </section>
        <section className="rounded-[22px] border border-white/8 bg-[#111113] p-5">
          <div className="flex items-center gap-3">
            <Flame className="text-amber-300" size={22} />
            <h2 className="text-lg font-black text-white">Current streak</h2>
          </div>
          <p className="mt-4 text-3xl font-black text-white">6 days</p>
          <p className="mt-3 text-sm text-zinc-400">Best run: 18 days. Keep the chain warm.</p>
        </section>
        <section className="rounded-[22px] border border-white/8 bg-[#111113] p-5">
          <div className="flex items-center gap-3">
            <Headphones className="text-cyan-300" size={22} />
            <h2 className="text-lg font-black text-white">Recommended now</h2>
          </div>
          <p className="mt-4 text-3xl font-black text-white">{heroPlaylist.title}</p>
          <p className="mt-3 text-sm text-zinc-400">{heroPlaylist.description}</p>
        </section>
      </div>

      <HorizontalScroller title="Favorite playlists" subtitle="Artwork-rich, session-ready mixes">
        {demoPlaylists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}
      </HorizontalScroller>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="rounded-[24px] border border-white/8 bg-[#111113] p-5">
          <h2 className="text-2xl font-black text-white">Recently played</h2>
          <div className="mt-4 space-y-1">
            {demoTracks.slice(0, 5).map((track, index) => <TrackRow key={track.id} index={index + 1} queue={demoTracks} track={track} />)}
          </div>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-[#111113] p-5">
          <h2 className="text-2xl font-black text-white">Quick focus modes</h2>
          <div className="mt-4 grid gap-3">
            {['Pomodoro · 25/5', 'Deep Work · 90 min', 'Open Session · no countdown'].map((mode) => (
              <Link key={mode} to="/focus" className="rounded-[18px] border border-white/8 bg-white/[0.04] p-4 font-bold text-white transition hover:border-[#22e26b]/40 hover:bg-[#22e26b]/10">
                {mode}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
