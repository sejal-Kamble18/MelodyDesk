import { isSupabaseConfigured, supabase } from '../lib/supabase';

export type RoomPhase = 'focus' | 'short-break' | 'long-break' | 'free';

export type StudyRoom = {
  id: string;
  code: string;
  name: string;
  created_by: string;
  max_members: number;
  current_phase: RoomPhase;
  is_running: boolean;
  planned_seconds: number;
  updated_at: string;
};

export type StudyRoomMember = {
  room_id: string;
  user_id: string;
  display_name: string;
  joined_at: string;
  last_seen_at: string;
};

const requireSupabase = () => {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
};

export const createStudyRoom = async (name: string, displayName: string, roomCapacity = 10) => {
  requireSupabase();
  const { data, error } = await supabase.rpc('create_study_room', { room_name: name, display_name: displayName, room_capacity: roomCapacity });
  if (error) throw new Error(error.message, { cause: error });
  return data as StudyRoom;
};

export const joinStudyRoom = async (code: string, displayName: string) => {
  requireSupabase();
  const { data, error } = await supabase.rpc('join_study_room', { room_code: code, display_name: displayName });
  if (error) throw new Error(error.message, { cause: error });
  return data as StudyRoom;
};

export const loadStudyRoom = async (roomId: string) => {
  const { data, error } = await supabase.from('study_rooms').select('*').eq('id', roomId).single();
  if (error) throw new Error(error.message, { cause: error });
  return data as StudyRoom;
};

export const loadStudyRoomMembers = async (roomId: string) => {
  const { data, error } = await supabase
    .from('study_room_members')
    .select('*')
    .eq('room_id', roomId)
    .order('joined_at', { ascending: true });
  if (error) throw new Error(error.message, { cause: error });
  return (data ?? []) as StudyRoomMember[];
};

export const updateStudyRoomState = async (roomId: string, phase: RoomPhase, isRunning: boolean, plannedSeconds: number) => {
  const { error } = await supabase
    .from('study_rooms')
    .update({ current_phase: phase, is_running: isRunning, planned_seconds: plannedSeconds, updated_at: new Date().toISOString() })
    .eq('id', roomId);
  if (error) throw new Error(error.message, { cause: error });
};

export const leaveStudyRoom = async (roomId: string) => {
  const { error } = await supabase.from('study_room_members').delete().eq('room_id', roomId);
  if (error) throw new Error(error.message, { cause: error });
};

export const subscribeToStudyRoom = (roomId: string, onChange: () => void) => {
  const channel = supabase
    .channel(`study-room:${roomId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'study_rooms', filter: `id=eq.${roomId}` }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'study_room_members', filter: `room_id=eq.${roomId}` }, onChange)
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
};
