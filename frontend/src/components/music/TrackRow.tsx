import { Heart, MoreHorizontal, Play } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import type { DemoTrack } from '../../services/musicMock';
import { Artwork } from './Artwork';
import { IconButton } from '../common/IconButton';

interface TrackRowProps {
  track: DemoTrack;
  index?: number;
  queue?: DemoTrack[];
}

export const TrackRow = ({ track, index, queue }: TrackRowProps) => {
  const { currentTrack, isPlaying, likedTrackIds, playTrack, toggleLike } = usePlayerStore();
  const active = currentTrack.id === track.id;
  const playbackLabel = track.playbackKind === 'full' ? 'Playable' : track.playbackKind === 'metadata' ? 'Metadata only' : 'Playable preview';

  return (
    <div className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[14px] px-3 py-3 transition hover:bg-white/[0.06]">
      <button
        aria-label={`Play ${track.title}`}
        className="relative flex items-center gap-3 text-left"
        onClick={() => playTrack(track, queue)}
        type="button"
      >
        <span className="hidden w-6 text-center text-sm text-zinc-500 sm:block">{active && isPlaying ? '•' : index}</span>
        <Artwork imageUrl={track.artworkUrl} label={track.artwork} palette={track.palette} className="h-12 w-12 rounded-xl" />
        <span className="absolute left-9 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/65 p-1 text-white group-hover:block">
          <Play size={14} fill="currentColor" />
        </span>
      </button>
      <div className="min-w-0">
        <p className={`truncate text-sm font-bold ${active ? 'text-[#22e26b]' : 'text-white'}`}>{track.title}</p>
        <p className="truncate text-xs text-zinc-400">{track.artist} - {playbackLabel}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-zinc-500 sm:inline">{track.durationLabel}</span>
        <IconButton aria-label={likedTrackIds.includes(track.id) ? 'Unlike track' : 'Like track'} active={likedTrackIds.includes(track.id)} onClick={() => toggleLike(track.id)}>
          <Heart size={17} fill={likedTrackIds.includes(track.id) ? 'currentColor' : 'none'} />
        </IconButton>
        <IconButton aria-label="Track options">
          <MoreHorizontal size={18} />
        </IconButton>
      </div>
    </div>
  );
};
