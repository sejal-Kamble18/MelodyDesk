import { Link } from 'react-router-dom';
import { Play, Radio, Sparkles } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { Artwork } from '../components/music/Artwork';
import { HorizontalScroller } from '../components/music/HorizontalScroller';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { SearchInput } from '../components/music/SearchInput';
import { TrackRow } from '../components/music/TrackRow';
import { Button } from '../components/ui/Button';
import { demoArtists, demoPlaylists, demoTracks } from '../services/musicMock';
import { usePlayerStore } from '../store/playerStore';
import { useState } from 'react';

const moods = ['Coding', 'Study', 'Instrumental', 'Ambient', 'Piano', 'Electronic', 'Lo-fi', 'Nature sounds'];

export const DiscoverPage = () => {
  const [query, setQuery] = useState('');
  const playTrack = usePlayerStore((state) => state.playTrack);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-[28px] border border-white/8 bg-[#111113] p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#22e26b]">
            <Radio size={14} /> Discover
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-none text-white">Find the sound your next session needs.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">Explore tracks, moods, playlists, and focus categories without leaving the work surface.</p>
          <div className="mt-8">
            <SearchInput value={query} onChange={setQuery} />
          </div>
        </div>
        <div className="rounded-[28px] border border-white/8 bg-gradient-to-br from-[#22e26b]/18 to-[#17171a] p-5">
          <Artwork label="FM" palette="from-emerald-200 via-lime-500 to-black" className="aspect-square w-full" />
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#22e26b]">Featured mix</p>
            <h2 className="mt-2 text-3xl font-black text-white">Focus Motion</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">A moving set for coding, studying, and steady evening execution.</p>
            <div className="mt-5 flex gap-3">
              <Button onClick={() => playTrack(demoTracks[0], demoTracks)}><Play size={17} fill="currentColor" /> Play</Button>
              <Button variant="secondary"><Link to="/focus">Start focus</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <HorizontalScroller title="Featured playlists" subtitle="Music-first cards with real session actions">
        {demoPlaylists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}
      </HorizontalScroller>

      <section className="rounded-[24px] border border-white/8 bg-[#111113] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">Trending tracks</h2>
          <Sparkles className="text-[#22e26b]" size={22} />
        </div>
        <div className="space-y-1">
          {demoTracks.map((track, index) => <TrackRow key={track.id} index={index + 1} queue={demoTracks} track={track} />)}
        </div>
      </section>

      <HorizontalScroller title="Popular artists" subtitle="Curated identities for the MelodyDesk demo catalog">
        {demoArtists.map((artist) => (
          <article key={artist.id} className="min-w-[190px] rounded-[20px] border border-white/8 bg-[#111113] p-4">
            <Artwork label={artist.artwork} palette={artist.palette} className="aspect-square w-full rounded-full" />
            <h3 className="mt-4 truncate text-center font-black text-white">{artist.name}</h3>
            <p className="mt-1 text-center text-sm text-zinc-400">{artist.genre}</p>
          </article>
        ))}
      </HorizontalScroller>

      <section>
        <h2 className="text-2xl font-black text-white">Moods and focus categories</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {moods.map((mood) => (
            <button key={mood} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-zinc-200 transition hover:border-[#22e26b]/50 hover:bg-[#22e26b]/10" type="button">
              {mood}
            </button>
          ))}
        </div>
      </section>

      {query && query.length < 2 ? (
        <EmptyState title="Keep typing" description="Use at least two characters to search the demo music catalog." />
      ) : null}
    </div>
  );
};
