import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoTracks, type DemoTrack } from '../services/musicMock';

type RepeatMode = 'off' | 'one' | 'all';

interface PlayerState {
  currentTrack: DemoTrack;
  queue: DemoTrack[];
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  progress: number;
  shuffle: boolean;
  repeat: RepeatMode;
  likedTrackIds: string[];
  playTrack: (track: DemoTrack, queue?: DemoTrack[]) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleLike: (trackId: string) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: demoTracks[0],
      queue: demoTracks,
      isPlaying: false,
      volume: 72,
      muted: false,
      progress: 0,
      shuffle: false,
      repeat: 'off',
      likedTrackIds: ['aurora-terminal', 'paper-lanterns'],
      playTrack: (track, queue = get().queue) => set({ currentTrack: track, queue, isPlaying: true, progress: 0 }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      next: () => {
        const { currentTrack, queue, shuffle } = get();
        const nextTrack = shuffle ? queue[Math.floor(Math.random() * queue.length)] : queue[(queue.findIndex((track) => track.id === currentTrack.id) + 1) % queue.length];
        set({ currentTrack: nextTrack ?? currentTrack, isPlaying: true, progress: 0 });
      },
      previous: () => {
        const { currentTrack, queue } = get();
        const index = queue.findIndex((track) => track.id === currentTrack.id);
        const previousTrack = queue[index <= 0 ? queue.length - 1 : index - 1];
        set({ currentTrack: previousTrack ?? currentTrack, isPlaying: true, progress: 0 });
      },
      setVolume: (volume) => set({ volume: clamp(volume, 0, 100), muted: volume === 0 }),
      setProgress: (progress) => set({ progress: clamp(progress, 0, get().currentTrack.duration) }),
      toggleMute: () => set((state) => ({ muted: !state.muted })),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      cycleRepeat: () => set((state) => ({ repeat: state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off' })),
      toggleLike: (trackId) =>
        set((state) => ({
          likedTrackIds: state.likedTrackIds.includes(trackId)
            ? state.likedTrackIds.filter((id) => id !== trackId)
            : [...state.likedTrackIds, trackId],
        })),
    }),
    {
      name: 'melodydesk-player',
      partialize: (state) => ({
        currentTrack: state.currentTrack,
        queue: state.queue,
        volume: state.volume,
        muted: state.muted,
        progress: state.progress,
        shuffle: state.shuffle,
        repeat: state.repeat,
        likedTrackIds: state.likedTrackIds,
      }),
    },
  ),
);
