import type { Activity, FocusSession, FocusSound, Goal, Playlist, Preferences, Track } from '../types/product';

export const activities: Activity[] = [
  { id: 'coding', name: 'Coding', description: 'Deep technical focus', icon: '</>', genres: ['Electronic', 'Synthwave', 'Lo-fi'] },
  { id: 'study', name: 'Study', description: 'Learning and revision', icon: 'AB', genres: ['Classical', 'Lo-fi', 'Ambient'] },
  { id: 'work', name: 'Work', description: 'Meetings, email, execution', icon: 'WK', genres: ['Instrumental', 'Soft Pop', 'Ambient'] },
  { id: 'reading', name: 'Reading', description: 'Quiet attention', icon: 'RD', genres: ['Classical', 'Nature', 'Piano'] },
  { id: 'writing', name: 'Writing', description: 'Drafting and editing', icon: 'WR', genres: ['Piano', 'Ambient', 'Lo-fi'] },
  { id: 'design', name: 'Design', description: 'Creative flow', icon: 'DS', genres: ['Indie', 'Electronic', 'Pop'] },
  { id: 'workout', name: 'Workout', description: 'High energy sessions', icon: 'HI', genres: ['EDM', 'Hip-hop', 'Pop'] },
  { id: 'meditation', name: 'Meditation', description: 'Calm and reset', icon: 'OM', genres: ['Nature', 'Ambient', 'White Noise'] },
  { id: 'custom', name: 'Custom', description: 'Name your own activity', icon: 'CU', genres: ['User choice'] },
];

export const focusSounds: FocusSound[] = [
  { id: 'rain', name: 'Rain on Glass', mood: 'steady calm', source: 'native', duration: 'loop' },
  { id: 'brown-noise', name: 'Brown Noise', mood: 'deep mask', source: 'native', duration: 'loop' },
  { id: 'cafe', name: 'Low Cafe', mood: 'soft activity', source: 'native', duration: 'loop' },
  { id: 'ocean', name: 'Ocean Wash', mood: 'open breath', source: 'native', duration: 'loop' },
  { id: 'classical', name: 'Public Domain Piano', mood: 'structured calm', source: 'native', duration: '54 min' },
];

export const playlists: Playlist[] = [
  {
    id: 'deep-code',
    title: 'Deep Code Current',
    owner: 'External catalog',
    description: 'Electronic and lo-fi picks for long implementation runs.',
    tracks: 64,
    source: 'spotify',
    accent: 'from-emerald-500 to-cyan-400',
    recommendedFor: ['coding', 'design'],
  },
  {
    id: 'study-piano',
    title: 'Quiet Study Piano',
    owner: 'MelodyDesk focus sounds',
    description: 'Public-domain piano references and silent-room ambience.',
    tracks: 22,
    source: 'native',
    accent: 'from-lime-400 to-emerald-600',
    recommendedFor: ['study', 'reading', 'writing'],
  },
  {
    id: 'office-flow',
    title: 'Office Flow',
    owner: 'External catalog',
    description: 'Warm instrumental tracks for predictable work blocks.',
    tracks: 48,
    source: 'spotify',
    accent: 'from-green-500 to-teal-500',
    recommendedFor: ['work', 'writing'],
  },
  {
    id: 'move-mode',
    title: 'Move Mode',
    owner: 'External catalog',
    description: 'Upbeat mixes for workouts and active desk breaks.',
    tracks: 77,
    source: 'spotify',
    accent: 'from-yellow-400 to-green-500',
    recommendedFor: ['workout'],
  },
];

export const tracks: Track[] = [
  { id: 't1', title: 'Luminous Loop', artist: 'Provider track', album: 'Catalog search', duration: '3:42', source: 'spotify', premium: true },
  { id: 't2', title: 'Static Shore', artist: 'MelodyDesk Native', album: 'Focus Sounds', duration: 'loop', source: 'native' },
  { id: 't3', title: 'Terminal Glow', artist: 'Provider track', album: 'Coding Finds', duration: '4:11', source: 'spotify', premium: true },
  { id: 't4', title: 'Piano Room No. 2', artist: 'Public domain recording', album: 'Open Focus', duration: '6:04', source: 'native' },
];

export const sessions: FocusSession[] = [
  {
    id: 's1',
    title: 'API Integration',
    activity: 'coding',
    mode: 'pomodoro',
    musicSource: 'spotify',
    playlistName: 'Deep Code Current',
    plannedMinutes: 50,
    completedMinutes: 50,
    status: 'completed',
    completedAt: 'Yesterday',
  },
  {
    id: 's2',
    title: 'Spanish Literature',
    activity: 'study',
    mode: 'custom',
    musicSource: 'focus-sound',
    playlistName: 'Rain on Glass',
    plannedMinutes: 45,
    completedMinutes: 45,
    status: 'completed',
    completedAt: 'Jul 28',
  },
  {
    id: 's3',
    title: 'Brand Identity',
    activity: 'design',
    mode: 'free',
    musicSource: 'spotify',
    playlistName: 'Office Flow',
    plannedMinutes: 120,
    completedMinutes: 135,
    status: 'completed',
    completedAt: 'Jul 26',
  },
];

export const goals: Goal[] = [
  { id: 'g1', label: 'Daily focus', period: 'Today', targetMinutes: 240, completedMinutes: 185 },
  { id: 'g2', label: 'Weekly deep work', period: 'This week', targetMinutes: 1200, completedMinutes: 760 },
  { id: 'g3', label: 'Workout rhythm', period: 'This month', targetMinutes: 480, completedMinutes: 260 },
];

export const weeklyFocus = [
  { day: 'Mon', minutes: 150 },
  { day: 'Tue', minutes: 90 },
  { day: 'Wed', minutes: 210 },
  { day: 'Thu', minutes: 185 },
  { day: 'Fri', minutes: 130 },
  { day: 'Sat', minutes: 60 },
  { day: 'Sun', minutes: 105 },
];

export const defaultPreferences: Preferences = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  defaultActivity: 'coding',
  defaultMode: 'pomodoro',
  preferredMusicSource: 'spotify',
  autoStartBreaks: false,
  autoStartFocus: false,
  notificationsEnabled: true,
  sessionEndSoundEnabled: true,
  reducedMotion: false,
};
