import { useState } from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { TrackRow } from '../components/music/TrackRow';
import { Button } from '../components/ui/Button';
import { demoArtists, demoPlaylists, demoTracks } from '../services/musicMock';
import { usePlayerStore } from '../store/playerStore';
import { Artwork } from '../components/music/Artwork';

const tabs = ['liked songs', 'albums', 'artists', 'playlists', 'recently played'] as const;

export const LibraryPage = () => {
  const [tab, setTab] = useState<(typeof tabs)[number]>('liked songs');
  const [creating, setCreating] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const likedTrackIds = usePlayerStore((state) => state.likedTrackIds);
  const likedTracks = demoTracks.filter((track) => likedTrackIds.includes(track.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22e26b]">Library</p>
          <h1 className="mt-3 text-5xl font-black text-white">Your saved sound</h1>
        </div>
        <Button onClick={() => setCreating(true)}>Create playlist</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => <button key={item} className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${tab === item ? 'bg-white text-black' : 'bg-white/[0.06] text-zinc-300'}`} onClick={() => setTab(item)} type="button">{item}</button>)}
      </div>
      {tab === 'liked songs' ? (
        likedTracks.length ? <section className="rounded-[24px] border border-white/8 bg-[#111113] p-5">{likedTracks.map((track, index) => <TrackRow key={track.id} index={index + 1} queue={likedTracks} track={track} />)}</section> : <EmptyState title="No liked songs yet" description="Like tracks from Discover or Search to build this list." />
      ) : null}
      {tab === 'playlists' ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{demoPlaylists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}</div> : null}
      {tab === 'recently played' ? <section className="rounded-[24px] border border-white/8 bg-[#111113] p-5">{demoTracks.map((track, index) => <TrackRow key={track.id} index={index + 1} queue={demoTracks} track={track} />)}</section> : null}
      {tab === 'artists' ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{demoArtists.map((artist) => <article key={artist.id} className="rounded-[20px] border border-white/8 bg-[#111113] p-4 text-center"><Artwork label={artist.artwork} palette={artist.palette} className="mx-auto aspect-square w-36 rounded-full" /><h2 className="mt-4 font-black text-white">{artist.name}</h2><p className="text-sm text-zinc-400">{artist.genre}</p></article>)}</div> : null}
      {tab === 'albums' ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{demoTracks.slice(0, 4).map((track) => <article key={track.album} className="rounded-[20px] border border-white/8 bg-[#111113] p-4"><Artwork label={track.artwork} palette={track.palette} className="aspect-square w-full" /><h2 className="mt-4 font-black text-white">{track.album}</h2><p className="text-sm text-zinc-400">{track.artist}</p></article>)}</div> : null}
      {creating ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <form
            className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#111113] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
            onSubmit={(event) => {
              event.preventDefault();
              setCreating(false);
              setPlaylistName('');
              setTab('playlists');
            }}
          >
            <h2 className="text-2xl font-black text-white">Create playlist</h2>
            <p className="mt-2 text-sm text-zinc-400">This creates a local draft collection until playlist APIs are available.</p>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-zinc-300">Playlist name</span>
              <input className="h-12 w-full rounded-[14px] border border-white/10 bg-white/[0.06] px-4 text-white outline-none focus:border-[#22e26b]/70" onChange={(event) => setPlaylistName(event.target.value)} value={playlistName} />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
              <Button disabled={!playlistName.trim()} type="submit">Create draft</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};
