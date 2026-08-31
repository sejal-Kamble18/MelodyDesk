import { useCallback, useEffect, useState } from 'react';
import { Copy, DoorOpen, Play, Plus, Square, UsersRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import {
  createStudyRoom,
  joinStudyRoom,
  leaveStudyRoom,
  loadStudyRoom,
  loadStudyRoomMembers,
  subscribeToStudyRoom,
  updateStudyRoomState,
  type RoomPhase,
  type StudyRoom,
  type StudyRoomMember,
} from '../services/studyRoomService';

const phaseLabels: Record<RoomPhase, string> = {
  focus: 'Focus',
  'short-break': 'Short break',
  'long-break': 'Long break',
  free: 'Free focus',
};

export const StudyRoomsPage = () => {
  const user = useAuthStore((state) => state.user);
  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [members, setMembers] = useState<StudyRoomMember[]>([]);
  const [roomName, setRoomName] = useState('Deep Work Room');
  const [roomCapacity, setRoomCapacity] = useState(10);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const displayName = user?.name || user?.email || 'Member';

  const refresh = useCallback(async (roomId: string) => {
    const [nextRoom, nextMembers] = await Promise.all([loadStudyRoom(roomId), loadStudyRoomMembers(roomId)]);
    setRoom(nextRoom);
    setMembers(nextMembers);
  }, []);

  useEffect(() => {
    if (!room?.id) return undefined;
    return subscribeToStudyRoom(room.id, () => void refresh(room.id));
  }, [refresh, room?.id]);

  const enterRoom = async (nextRoom: StudyRoom) => {
    setRoom(nextRoom);
    setMembers(await loadStudyRoomMembers(nextRoom.id));
  };

  const run = async (task: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await task();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Room action failed.');
    } finally {
      setLoading(false);
    }
  };

  const setPhase = (phase: RoomPhase, seconds: number) => {
    if (!room) return;
    void run(async () => {
      await updateStudyRoomState(room.id, phase, true, seconds);
      await refresh(room.id);
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/8 bg-[#111113] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#22e26b]">Study rooms</p>
            <h1 className="mt-2 text-4xl font-black text-white">Focus together, music separately.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Share a room code, see members, and keep a lightweight group focus state in sync.</p>
          </div>
          {room ? (
            <Button variant="danger" onClick={() => void run(async () => { await leaveStudyRoom(room.id); setRoom(null); setMembers([]); })}>
              <DoorOpen size={18} /> Leave
            </Button>
          ) : null}
        </div>
      </section>

      {!room ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-[22px] border border-white/8 bg-[#111113] p-5">
            <h2 className="text-xl font-black text-white">Create room</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_110px_auto]">
              <Input value={roomName} onChange={(event) => setRoomName(event.target.value)} aria-label="Room name" />
              <Input
                aria-label="Room capacity"
                max={50}
                min={2}
                onChange={(event) => setRoomCapacity(Number(event.target.value))}
                type="number"
                value={roomCapacity}
              />
              <Button disabled={loading} onClick={() => void run(async () => enterRoom(await createStudyRoom(roomName, displayName, roomCapacity)))}>
                <Plus size={18} /> Create
              </Button>
            </div>
          </section>
          <section className="rounded-[22px] border border-white/8 bg-[#111113] p-5">
            <h2 className="text-xl font-black text-white">Join room</h2>
            <div className="mt-4 flex gap-3">
              <Input value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase())} placeholder="ROOMCODE" aria-label="Room code" />
              <Button disabled={loading} onClick={() => void run(async () => enterRoom(await joinStudyRoom(joinCode, displayName)))}>
                Join
              </Button>
            </div>
          </section>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <section className="rounded-[24px] border border-[#22e26b]/20 bg-[#111113] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-white">{room.name}</h2>
                <p className="mt-2 text-sm text-zinc-400">Code <span className="font-mono text-[#22e26b]">{room.code}</span> - {members.length}/{room.max_members} members</p>
              </div>
              <Button variant="secondary" onClick={() => void navigator.clipboard?.writeText(room.code)}>
                <Copy size={18} /> Copy
              </Button>
            </div>
            <div className="mt-8 rounded-[22px] border border-white/8 bg-black/25 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-500">Shared state</p>
              <p className="mt-3 text-5xl font-black text-white">{phaseLabels[room.current_phase]}</p>
              <p className="mt-2 text-zinc-400">{room.is_running ? 'Running' : 'Paused'} - {Math.round(room.planned_seconds / 60)} min</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => setPhase('focus', 1500)}><Play size={18} /> Focus</Button>
                <Button variant="secondary" onClick={() => setPhase('short-break', 300)}>Short break</Button>
                <Button variant="secondary" onClick={() => setPhase('long-break', 900)}>Long break</Button>
                <Button variant="ghost" onClick={() => setPhase('free', 0)}>Free</Button>
                <Button variant="ghost" onClick={() => void run(async () => { await updateStudyRoomState(room.id, room.current_phase, false, room.planned_seconds); await refresh(room.id); })}>
                  <Square size={18} /> Stop
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-white/8 bg-[#111113] p-5">
            <div className="flex items-center gap-3">
              <UsersRound className="text-[#22e26b]" size={22} />
              <h2 className="text-xl font-black text-white">Members</h2>
            </div>
            <div className="mt-4 space-y-2">
              {members.map((member) => (
                <div key={member.user_id} className="rounded-[16px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white">
                  {member.display_name}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
};
