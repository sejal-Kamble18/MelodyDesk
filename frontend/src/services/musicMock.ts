import type { ProviderTrack } from './musicService';

export type DemoTrack = ProviderTrack & {
  album: string;
  artwork: string;
  palette: string;
  mood: string;
  duration: number;
  durationLabel: string;
};

export type DemoPlaylist = {
  id: string;
  title: string;
  description: string;
  curator: string;
  artwork: string;
  palette: string;
  trackIds: string[];
  durationLabel: string;
  updatedAt: string;
};

export type DemoArtist = {
  id: string;
  name: string;
  genre: string;
  artwork: string;
  palette: string;
};

const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;

const sampleStreams = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
];

const createDemoTrack = (
  id: string,
  title: string,
  artist: string,
  album: string,
  duration: number,
  artwork: string,
  palette: string,
  mood: string,
  streamUrl: string,
): DemoTrack => ({
  id,
  provider: 'demo',
  providerTrackId: id,
  title,
  artist,
  album,
  durationSeconds: duration,
  duration,
  durationLabel: formatDuration(duration),
  artwork,
  palette,
  mood,
  streamUrl,
  playable: true,
  playbackKind: 'full',
  attribution: 'Royalty-free SoundHelix demo stream.',
});

export const demoTracks: DemoTrack[] = [
  createDemoTrack('aurora-terminal', 'Aurora Terminal', 'MelodyDesk Preview', 'Focus Motion', 224, 'AT', 'from-emerald-200 via-cyan-400 to-black', 'coding pulse', sampleStreams[0]),
  createDemoTrack('paper-lanterns', 'Paper Lanterns', 'MelodyDesk Preview', 'Quiet Study Piano', 184, 'PL', 'from-lime-100 via-emerald-400 to-zinc-950', 'soft study', sampleStreams[1]),
  createDemoTrack('low-orbit', 'Low Orbit', 'MelodyDesk Preview', 'Deep Code Current', 256, 'LO', 'from-cyan-200 via-blue-500 to-zinc-950', 'deep work', sampleStreams[2]),
  createDemoTrack('glass-rain', 'Glass Rain', 'MelodyDesk Preview', 'Rain Desk', 300, 'GR', 'from-slate-200 via-emerald-500 to-black', 'rain ambient', sampleStreams[3]),
  createDemoTrack('night-index', 'Night Index', 'MelodyDesk Preview', 'Office Flow', 211, 'NI', 'from-violet-200 via-fuchsia-500 to-black', 'evening flow', sampleStreams[4]),
  createDemoTrack('margin-notes', 'Margin Notes', 'MelodyDesk Preview', 'Reading Room', 198, 'MN', 'from-amber-100 via-teal-500 to-zinc-950', 'reading', sampleStreams[5]),
];

export const demoPlaylists: DemoPlaylist[] = [
  {
    id: 'focus-motion',
    title: 'Focus Motion',
    description: 'Clean electronic momentum for coding and implementation work.',
    curator: 'MelodyDesk',
    artwork: 'FM',
    palette: 'from-emerald-200 via-lime-500 to-black',
    trackIds: ['aurora-terminal', 'low-orbit', 'night-index'],
    durationLabel: '34 min',
    updatedAt: 'Today',
  },
  {
    id: 'quiet-study',
    title: 'Quiet Study Piano',
    description: 'A calm study surface for reading, revision, and note-making.',
    curator: 'MelodyDesk',
    artwork: 'QS',
    palette: 'from-lime-100 via-emerald-400 to-zinc-950',
    trackIds: ['paper-lanterns', 'margin-notes', 'glass-rain'],
    durationLabel: '28 min',
    updatedAt: 'This week',
  },
  {
    id: 'rain-desk',
    title: 'Rain Desk',
    description: 'Ambient metadata placeholders for sessions when provider credentials are absent.',
    curator: 'MelodyDesk',
    artwork: 'RD',
    palette: 'from-slate-100 via-cyan-500 to-zinc-950',
    trackIds: ['glass-rain', 'paper-lanterns'],
    durationLabel: '18 min',
    updatedAt: 'This week',
  },
  {
    id: 'office-flow',
    title: 'Office Flow',
    description: 'Low-friction tracks for planning, admin, and workday execution.',
    curator: 'MelodyDesk',
    artwork: 'OF',
    palette: 'from-teal-100 via-emerald-500 to-black',
    trackIds: ['night-index', 'margin-notes', 'aurora-terminal'],
    durationLabel: '31 min',
    updatedAt: 'Yesterday',
  },
];

export const demoArtists: DemoArtist[] = [
  { id: 'melodydesk-preview', name: 'MelodyDesk Preview', genre: 'Focus metadata', artwork: 'MD', palette: 'from-emerald-200 via-cyan-400 to-black' },
  { id: 'study-systems', name: 'Study Systems', genre: 'Piano and ambient', artwork: 'SS', palette: 'from-lime-100 via-emerald-500 to-zinc-950' },
  { id: 'desk-current', name: 'Desk Current', genre: 'Electronic focus', artwork: 'DC', palette: 'from-cyan-100 via-blue-500 to-black' },
  { id: 'quiet-rooms', name: 'Quiet Rooms', genre: 'Reading sound', artwork: 'QR', palette: 'from-stone-100 via-teal-500 to-zinc-950' },
];

export const getTracksByIds = (trackIds: string[]) => trackIds.map((id) => demoTracks.find((track) => track.id === id)).filter((track): track is DemoTrack => Boolean(track));

export const toDemoTrack = (track: ProviderTrack): DemoTrack => ({
  ...track,
  id: `${track.provider}:${track.providerTrackId}`,
  album: track.album || track.provider,
  artwork: track.artworkUrl ? 'AP' : track.title.slice(0, 2).toUpperCase(),
  palette: 'from-rose-100 via-fuchsia-500 to-zinc-950',
  mood: track.playbackKind === 'metadata' ? 'metadata only' : track.attribution || 'provider result',
  duration: track.durationSeconds,
  durationLabel: formatDuration(track.durationSeconds),
});

export const searchMusic = (query: string, category: string) => {
  const normalized = query.trim().toLowerCase();
  const match = (values: string[]) => !normalized || values.some((value) => value.toLowerCase().includes(normalized));

  return {
    tracks:
      category === 'all' || category === 'tracks' || category === 'albums'
        ? demoTracks.filter((track) => match([track.title, track.artist, track.album, track.mood]))
        : [],
    playlists:
      category === 'all' || category === 'playlists'
        ? demoPlaylists.filter((playlist) => match([playlist.title, playlist.description, playlist.curator]))
        : [],
    artists:
      category === 'all' || category === 'artists'
        ? demoArtists.filter((artist) => match([artist.name, artist.genre]))
        : [],
  };
};
