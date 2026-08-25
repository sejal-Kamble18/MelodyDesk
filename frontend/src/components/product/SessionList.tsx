import { activities } from '../../data/melodydesk';
import type { FocusSession } from '../../types/product';

interface SessionListProps {
  sessions: FocusSession[];
}

export const SessionList = ({ sessions }: SessionListProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#181818]">
      {sessions.map((session, index) => {
        const activity = activities.find((item) => item.id === session.activity);
        return (
          <div
            key={session.id}
            className={`grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center ${index === sessions.length - 1 ? '' : 'border-b border-white/8'}`}
          >
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-black text-xs font-bold text-[#1ed760]">
                {activity?.icon ?? 'MD'}
              </span>
              <div>
                <p className="font-bold text-white">{session.title}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {session.customActivityName || activity?.name || session.activity} | {session.completedMinutes} min | {session.playlistName}
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-400">{session.completedAt}</span>
          </div>
        );
      })}
    </div>
  );
};
