export type ActivityId =
  | 'study'
  | 'coding'
  | 'work'
  | 'reading'
  | 'writing'
  | 'design'
  | 'workout'
  | 'meditation'
  | 'custom';

export type SessionMode = 'pomodoro' | 'custom' | 'free';

export type MusicSource = 'spotify' | 'focus-sound' | 'silent';

export type Activity = {
  id: ActivityId;
  name: string;
  description: string;
  icon: string;
  genres: string[];
};

export type FocusSound = {
  id: string;
  name: string;
  mood: string;
  source: 'native';
  duration: string;
};

export type Playlist = {
  id: string;
  title: string;
  owner: string;
  description: string;
  tracks: number;
  source: 'spotify' | 'native';
  accent: string;
  recommendedFor: ActivityId[];
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  source: 'spotify' | 'native';
  premium?: boolean;
};

export type FocusSession = {
  id: string;
  title: string;
  activity: ActivityId;
  customActivityName?: string;
  mode: SessionMode;
  musicSource: MusicSource;
  playlistName: string;
  plannedMinutes: number;
  completedMinutes: number;
  status: 'completed' | 'finished-early' | 'active';
  completedAt: string;
};

export type Goal = {
  id: string;
  label: string;
  period: string;
  targetMinutes: number;
  completedMinutes: number;
};

export type Preferences = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  defaultActivity: ActivityId;
  defaultMode: SessionMode;
  preferredMusicSource: MusicSource;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  notificationsEnabled: boolean;
  sessionEndSoundEnabled: boolean;
  reducedMotion: boolean;
};
