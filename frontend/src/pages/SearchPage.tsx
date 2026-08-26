import { useEffect, useMemo, useState } from 'react';
import { Clock, Search as SearchIcon, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { Artwork } from '../components/music/Artwork';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { SearchInput } from '../components/music/SearchInput';
import { TrackRow } from '../components/music/TrackRow';
import { Button } from '../components/ui/Button';
import { searchMusic, toDemoTrack, type DemoTrack } from '../services/musicMock';
import { searchProviderTracks } from '../services/musicService';

const categories = ['all', 'tracks', 'artists', 'albums', 'playlists'] as const;
const popularSearches = ['Taylor Swift', 'Shakira', 'Arijit Singh', 'old Hindi songs', 'new songs'];

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('all');
  const [recent, setRecent] = useState<string[]>(['lo-fi', 'deep work']);
  const [providerTracks, setProviderTracks] = useState<DemoTrack[]>([]);
  const [providerStatus, setProviderStatus] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const results = useMemo(() => searchMusic(debouncedQuery, category), [category, debouncedQuery]);
  const providerSearchEnabled = debouncedQuery.trim().length >= 2 && (category === 'all' || category === 'tracks');
  const visibleProviderTracks = providerSearchEnabled ? providerTracks : [];
  const tracks = category === 'all' || category === 'tracks' ? [...visibleProviderTracks, ...results.tracks] : results.tracks;
  const hasResults = tracks.length || results.playlists.length || results.artists.length;
  const chooseSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length > 1) {
      setRecent((items) => [value.trim(), ...items.filter((item) => item !== value.trim())].slice(0, 5));
    }
  };

  useEffect(() => {
    if (!providerSearchEnabled) {
      return undefined;
    }

    let cancelled = false;
    void searchProviderTracks(debouncedQuery, 10)
      .then((result) => {
        if (cancelled) return;
        setProviderTracks(result.tracks.map(toDemoTrack));
        setProviderStatus(result.tracks.length ? result.attribution ?? null : 'No playable previews found. Try artist, song, or album names.');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setProviderTracks([]);
        setProviderStatus(error instanceof Error ? error.message : 'Music provider search is unavailable.');
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, providerSearchEnabled]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22e26b]">Search</p>
        <h1 className="mt-3 text-5xl font-black text-white">Search your focus catalog</h1>
      </div>
      <SearchInput value={query} onChange={setQuery} />
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button key={item} className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${category === item ? 'bg-white text-black' : 'bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1]'}`} onClick={() => setCategory(item)} type="button">
            {item}
          </button>
        ))}
      </div>

      {!debouncedQuery ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[24px] border border-white/8 bg-[#111113] p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-black text-white"><Clock size={22} /> Recent searches</h2>
              <Button variant="ghost" size="sm" onClick={() => setRecent([])}><Trash2 size={15} /> Clear</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {recent.map((item) => <button key={item} className="rounded-full bg-white/[0.06] px-4 py-2 text-sm font-bold text-zinc-300" onClick={() => chooseSearch(item)} type="button">{item}</button>)}
            </div>
          </section>
          <section className="rounded-[24px] border border-white/8 bg-[#111113] p-5">
            <h2 className="flex items-center gap-2 text-2xl font-black text-white"><SearchIcon size={22} /> Popular searches</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {popularSearches.map((item) => <button key={item} className="rounded-full bg-[#22e26b]/10 px-4 py-2 text-sm font-bold text-[#22e26b]" onClick={() => chooseSearch(item)} type="button">{item}</button>)}
            </div>
          </section>
        </div>
      ) : null}

      {providerSearchEnabled && providerStatus ? <p className="text-sm text-zinc-400">{providerStatus}</p> : null}

      {debouncedQuery && !hasResults ? <EmptyState title="No results" description="Try a mood, activity, artist, playlist, or album name from the catalog." /> : null}

      {tracks.length ? (
        <section className="rounded-[24px] border border-white/8 bg-[#111113] p-5">
          <h2 className="text-2xl font-black text-white">Tracks</h2>
          <div className="mt-4 space-y-1">{tracks.map((track, index) => <TrackRow key={track.id} index={index + 1} queue={tracks} track={track} />)}</div>
        </section>
      ) : null}
      {results.playlists.length ? (
        <section>
          <h2 className="mb-4 text-2xl font-black text-white">Playlists</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{results.playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}</div>
        </section>
      ) : null}
      {results.artists.length ? (
        <section>
          <h2 className="mb-4 text-2xl font-black text-white">Artists</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {results.artists.map((artist) => (
              <article key={artist.id} className="rounded-[20px] border border-white/8 bg-[#111113] p-4 text-center">
                <Artwork label={artist.artwork} palette={artist.palette} className="mx-auto aspect-square w-36 rounded-full" />
                <h3 className="mt-4 font-black text-white">{artist.name}</h3>
                <p className="text-sm text-zinc-400">{artist.genre}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};
