import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoTracks, toDemoTrack, type DemoTrack } from '../services/musicMock';
import { removeFavoriteTrack, resolvePlayableTrack, saveFavoriteTrack } from '../services/musicService';

type RepeatMode = 'off' | 'one' | 'all';

interface PlayerState {
  currentTrack: DemoTrack;
  queue: DemoTrack[];
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  progress: number;
  isLoading: boolean;
  error: string | null;
  shuffle: boolean;
  repeat: RepeatMode;
  likedTrackIds: string[];
  playTrack: (track: DemoTrack, queue?: DemoTrack[]) => Promise<void>;
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
      isLoading: false,
      error: null,
      shuffle: false,
      repeat: 'off',
      likedTrackIds: ['aurora-terminal', 'paper-lanterns'],
      playTrack: async (track, queue = get().queue) => {
        set({ error: null, isLoading: !track.streamUrl });
        if (!track.playable && !track.streamUrl) {
          set({ currentTrack: track, queue, isPlaying: false, isLoading: false, error: 'This catalog item is metadata-only. Full playback needs an authorized provider session.' });
          return;
        }
        try {
          const playable = toDemoTrack(await resolvePlayableTrack(track));
          set({ currentTrack: playable, queue: queue.map((item) => (item.id === track.id ? playable : item)), isPlaying: true, progress: 0, isLoading: false });
        } catch (error) {
          set({ currentTrack: track, queue, isPlaying: false, isLoading: false, error: error instanceof Error ? error.message : 'Playable audio is unavailable.' });
        }
      },
      togglePlay: () => set((state) => ({ error: null, isPlaying: state.currentTrack.streamUrl ? !state.isPlaying : false })),
      next: () => {
        const { currentTrack, queue, shuffle } = get();
        const nextTrack = shuffle ? queue[Math.floor(Math.random() * queue.length)] : queue[(queue.findIndex((track) => track.id === currentTrack.id) + 1) % queue.length];
        void get().playTrack(nextTrack ?? currentTrack, queue);
      },
      previous: () => {
        const { currentTrack, queue } = get();
        const index = queue.findIndex((track) => track.id === currentTrack.id);
        const previousTrack = queue[index <= 0 ? queue.length - 1 : index - 1];
        void get().playTrack(previousTrack ?? currentTrack, queue);
      },
      setVolume: (volume) => set({ volume: clamp(volume, 0, 100), muted: volume === 0 }),
      setProgress: (progress) => set({ progress: clamp(progress, 0, get().currentTrack.duration) }),
      toggleMute: () => set((state) => ({ muted: !state.muted })),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      cycleRepeat: () => set((state) => ({ repeat: state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off' })),
      toggleLike: (trackId) => {
        const track = get().queue.find((item) => item.id === trackId) ?? (get().currentTrack.id === trackId ? get().currentTrack : undefined);
        const wasLiked = get().likedTrackIds.includes(trackId);
        set((state) => ({
          likedTrackIds: state.likedTrackIds.includes(trackId)
            ? state.likedTrackIds.filter((id) => id !== trackId)
            : [...state.likedTrackIds, trackId],
        }));
        if (track) {
          void (wasLiked ? removeFavoriteTrack(track) : saveFavoriteTrack(track)).catch(() => undefined);
        }
      },
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
