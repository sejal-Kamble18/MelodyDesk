import { useEffect } from 'react';
import { Heart, Laptop, ListMusic, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { IconButton } from '../common/IconButton';
import { Artwork } from '../music/Artwork';
import { usePlayerStore } from '../../store/playerStore';

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
};

export const MusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    muted,
    progress,
    shuffle,
    repeat,
    likedTrackIds,
    togglePlay,
    next,
    previous,
    setVolume,
    setProgress,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleLike,
  } = usePlayerStore();

  useEffect(() => {
    if (!isPlaying) return undefined;
    const interval = window.setInterval(() => {
      const nextProgress = usePlayerStore.getState().progress + 1;
      if (nextProgress >= usePlayerStore.getState().currentTrack.duration) {
        usePlayerStore.getState().next();
        return;
      }
      usePlayerStore.getState().setProgress(nextProgress);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070707]/96 px-3 py-3 shadow-[0_-18px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1800px] gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(360px,620px)_minmax(0,1fr)] lg:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <Artwork label={currentTrack.artwork} palette={currentTrack.palette} className="h-14 w-14 shrink-0 rounded-[14px]" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{currentTrack.title}</p>
            <p className="truncate text-xs text-zinc-400">{currentTrack.artist} · {currentTrack.mood}</p>
          </div>
          <IconButton aria-label={likedTrackIds.includes(currentTrack.id) ? 'Unlike current track' : 'Like current track'} active={likedTrackIds.includes(currentTrack.id)} onClick={() => toggleLike(currentTrack.id)}>
            <Heart size={18} fill={likedTrackIds.includes(currentTrack.id) ? 'currentColor' : 'none'} />
          </IconButton>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2">
            <IconButton aria-label="Toggle shuffle" active={shuffle} onClick={toggleShuffle}>
              <Shuffle size={18} />
            </IconButton>
            <IconButton aria-label="Previous track" onClick={previous}>
              <SkipBack size={19} fill="currentColor" />
            </IconButton>
            <button
              aria-label={isPlaying ? 'Pause playback' : 'Play playback'}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-[0_14px_40px_rgba(255,255,255,0.15)] transition hover:scale-105"
              onClick={togglePlay}
              type="button"
            >
              {isPlaying ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" className="ml-0.5" />}
            </button>
            <IconButton aria-label="Next track" onClick={next}>
              <SkipForward size={19} fill="currentColor" />
            </IconButton>
            <IconButton aria-label="Cycle repeat" active={repeat !== 'off'} onClick={cycleRepeat}>
              {repeat === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </IconButton>
          </div>
          <div className="mt-2 grid grid-cols-[42px_1fr_42px] items-center gap-2 text-[11px] text-zinc-500">
            <span className="text-right">{formatSeconds(progress)}</span>
            <input
              aria-label="Playback progress"
              className="h-1 w-full accent-[#22e26b]"
              max={currentTrack.duration}
              min="0"
              onChange={(event) => setProgress(Number(event.target.value))}
              type="range"
              value={progress}
            />
            <span>{currentTrack.durationLabel}</span>
          </div>
        </div>

        <div className="hidden items-center justify-end gap-2 lg:flex">
          <IconButton aria-label="Current device">
            <Laptop size={18} />
          </IconButton>
          <IconButton aria-label="Open queue">
            <ListMusic size={18} />
          </IconButton>
          <IconButton aria-label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </IconButton>
          <input
            aria-label="Player volume"
            className="h-1 w-28 accent-[#22e26b]"
            max="100"
            min="0"
            onChange={(event) => setVolume(Number(event.target.value))}
            type="range"
            value={muted ? 0 : volume}
          />
          <span className="w-8 text-right text-xs text-zinc-500">{muted ? 0 : volume}</span>
        </div>
      </div>
    </div>
  );
};
