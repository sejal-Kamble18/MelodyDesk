import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { defaultPreferences } from '../data/melodydesk';
import type { FocusSession, Preferences } from '../types/product';

type FocusSessionRow = {
  id: string;
  title: string;
  activity: FocusSession['activity'];
  custom_activity_name: string | null;
  mode: FocusSession['mode'];
  music_source: FocusSession['musicSource'];
  playlist_name: string;
  planned_minutes: number;
  completed_minutes: number;
  status: FocusSession['status'];
  completed_at: string;
};

type PreferencesRow = {
  focus_minutes: number;
  short_break_minutes: number;
  long_break_minutes: number;
  long_break_interval: number;
  default_activity: Preferences['defaultActivity'];
  default_mode: Preferences['defaultMode'];
  preferred_music_source: Preferences['preferredMusicSource'];
  auto_start_breaks: boolean;
  auto_start_focus: boolean;
  notifications_enabled: boolean;
  session_end_sound_enabled: boolean;
  reduced_motion: boolean;
};

const toSession = (row: FocusSessionRow): FocusSession => ({
  id: row.id,
  title: row.title,
  activity: row.activity,
  customActivityName: row.custom_activity_name ?? undefined,
  mode: row.mode,
  musicSource: row.music_source,
  playlistName: row.playlist_name,
  plannedMinutes: row.planned_minutes,
  completedMinutes: row.completed_minutes,
  status: row.status,
  completedAt: new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(row.completed_at)),
  completedAtIso: row.completed_at,
});

const toPreferences = (row: PreferencesRow): Preferences => ({
  focusMinutes: row.focus_minutes,
  shortBreakMinutes: row.short_break_minutes,
  longBreakMinutes: row.long_break_minutes,
  longBreakInterval: row.long_break_interval,
  defaultActivity: row.default_activity,
  defaultMode: row.default_mode,
  preferredMusicSource: row.preferred_music_source,
  autoStartBreaks: row.auto_start_breaks,
  autoStartFocus: row.auto_start_focus,
  notificationsEnabled: row.notifications_enabled,
  sessionEndSoundEnabled: row.session_end_sound_enabled,
  reducedMotion: row.reduced_motion,
});

const fromPreferences = (preferences: Preferences): PreferencesRow => ({
  focus_minutes: preferences.focusMinutes,
  short_break_minutes: preferences.shortBreakMinutes,
  long_break_minutes: preferences.longBreakMinutes,
  long_break_interval: preferences.longBreakInterval,
  default_activity: preferences.defaultActivity,
  default_mode: preferences.defaultMode,
  preferred_music_source: preferences.preferredMusicSource,
  auto_start_breaks: preferences.autoStartBreaks,
  auto_start_focus: preferences.autoStartFocus,
  notifications_enabled: preferences.notificationsEnabled,
  session_end_sound_enabled: preferences.sessionEndSoundEnabled,
  reduced_motion: preferences.reducedMotion,
});

const getUserId = async () => {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
};

export const loadFocusSessions = async (): Promise<FocusSession[]> => {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('focus_sessions')
    .select('id,title,activity,custom_activity_name,mode,music_source,playlist_name,planned_minutes,completed_minutes,status,completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) throw new Error(error.message, { cause: error });
  return (data ?? []).map((row) => toSession(row as FocusSessionRow));
};

export const saveFocusSession = async (session: FocusSession) => {
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase.from('focus_sessions').upsert({
    id: session.id,
    user_id: userId,
    title: session.title,
    activity: session.activity,
    custom_activity_name: session.customActivityName ?? null,
    mode: session.mode,
    music_source: session.musicSource,
    playlist_name: session.playlistName,
    planned_minutes: session.plannedMinutes,
    completed_minutes: session.completedMinutes,
    status: session.status,
    completed_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message, { cause: error });
};

export const loadPreferences = async (): Promise<Preferences> => {
  const userId = await getUserId();
  if (!userId) return defaultPreferences;

  const { data, error } = await supabase.from('preferences').select('*').eq('user_id', userId).maybeSingle();
  if (error) throw new Error(error.message, { cause: error });
  if (!data) return defaultPreferences;
  return toPreferences(data as PreferencesRow);
};

export const savePreferences = async (preferences: Preferences) => {
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase.from('preferences').upsert({
    user_id: userId,
    ...fromPreferences(preferences),
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message, { cause: error });
};
