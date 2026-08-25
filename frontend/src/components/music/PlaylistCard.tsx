import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { demoTracks, getTracksByIds, type DemoPlaylist } from '../../services/musicMock';
import { usePlayerStore } from '../../store/playerStore';
import { Artwork } from './Artwork';
import { IconButton } from '../common/IconButton';

interface PlaylistCardProps {
  playlist: DemoPlaylist;
}

export const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const tracks = getTracksByIds(playlist.trackIds);

  return (
    <article className="group min-w-[220px] rounded-[20px] border border-white/8 bg-[#111113] p-4 transition hover:-translate-y-1 hover:bg-[#17171a] hover:shadow-[0_24px_80px_rgba(0,0,0,0.36)]">
      <Link to={`/playlists/${playlist.id}`} aria-label={`Open ${playlist.title}`}>
        <Artwork label={playlist.artwork} palette={playlist.palette} className="aspect-square w-full" />
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={`/playlists/${playlist.id}`} className="truncate text-base font-bold text-white hover:underline">
            {playlist.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-400">{playlist.description}</p>
        </div>
        <IconButton
          aria-label={`Play ${playlist.title}`}
          className="h-11 w-11 shrink-0 bg-[#22e26b] text-black opacity-100 shadow-[0_12px_40px_rgba(34,226,107,0.28)] hover:bg-[#35f27b] hover:text-black sm:opacity-0 sm:group-hover:opacity-100"
          onClick={() => playTrack(tracks[0] ?? demoTracks[0], tracks.length ? tracks : demoTracks)}
        >
          <Play size={18} fill="currentColor" />
        </IconButton>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>{playlist.trackIds.length} tracks</span>
        <span>{playlist.durationLabel}</span>
      </div>
    </article>
  );
};
