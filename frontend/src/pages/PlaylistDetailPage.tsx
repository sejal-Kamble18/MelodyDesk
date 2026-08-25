import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Edit3, Play, Shuffle, Trash2 } from 'lucide-react';
import { Artwork } from '../components/music/Artwork';
import { TrackRow } from '../components/music/TrackRow';
import { Button } from '../components/ui/Button';
import { demoPlaylists, demoTracks, getTracksByIds } from '../services/musicMock';
import { usePlayerStore } from '../store/playerStore';

export const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const playlist = demoPlaylists.find((item) => item.id === playlistId) ?? demoPlaylists[0];
  const tracks = getTracksByIds(playlist.trackIds);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [editing, setEditing] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) {
    return (
      <div className="rounded-[24px] border border-white/8 bg-[#111113] p-8">
        <h1 className="text-4xl font-black text-white">Playlist removed locally</h1>
        <p className="mt-3 text-zinc-400">Connect the playlist API to persist deletes across devices.</p>
        <Button className="mt-6"><Link to="/playlists">Back to playlists</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[28px] border border-white/8 bg-[#111113] p-6 lg:grid-cols-[280px_1fr] lg:items-end">
        <Artwork label={playlist.artwork} palette={playlist.palette} className="aspect-square w-full max-w-[280px]" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22e26b]">Playlist</p>
          <h1 className="mt-3 text-5xl font-black leading-none text-white sm:text-7xl">{playlist.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">{playlist.description}</p>
          <p className="mt-3 text-sm text-zinc-500">{playlist.curator} · {tracks.length} tracks · {playlist.durationLabel} · Updated {playlist.updatedAt}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={() => playTrack(tracks[0] ?? demoTracks[0], tracks)}><Play size={18} fill="currentColor" /> Play</Button>
            <Button variant="secondary" onClick={() => playTrack(tracks[Math.floor(Math.random() * tracks.length)] ?? demoTracks[0], tracks)}><Shuffle size={18} /> Shuffle</Button>
            <Button variant="ghost" onClick={() => setEditing(true)}><Edit3 size={17} /> Edit</Button>
            <Button variant="danger" onClick={() => { if (window.confirm('Delete this local playlist draft?')) setDeleted(true); }}><Trash2 size={17} /> Delete</Button>
          </div>
        </div>
      </section>
      <section className="rounded-[24px] border border-white/8 bg-[#111113] p-5">
        <div className="mb-3 grid grid-cols-[1fr_auto] px-3 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
          <span>Track</span>
          <span>Duration</span>
        </div>
        {tracks.map((track, index) => <TrackRow key={track.id} index={index + 1} queue={tracks} track={track} />)}
      </section>
      <Link className="text-sm font-bold text-zinc-400 hover:text-white" to="/playlists">Back to playlists</Link>
      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <form className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#111113] p-6" onSubmit={(event) => { event.preventDefault(); setEditing(false); }}>
            <h2 className="text-2xl font-black text-white">Edit playlist details</h2>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-zinc-300">Title</span>
              <input className="h-12 w-full rounded-[14px] border border-white/10 bg-white/[0.06] px-4 text-white outline-none focus:border-[#22e26b]/70" defaultValue={playlist.title} />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-zinc-300">Description</span>
              <textarea className="min-h-24 w-full rounded-[14px] border border-white/10 bg-white/[0.06] p-4 text-white outline-none focus:border-[#22e26b]/70" defaultValue={playlist.description} />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button type="submit">Save local draft</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};
