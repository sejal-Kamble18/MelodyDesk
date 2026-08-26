import { weeklyFocus } from '../../data/melodydesk';
import type { FocusSession } from '../../types/product';

interface WeeklyFocusChartProps {
  sessions?: FocusSession[];
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const buildWeek = (sessions: FocusSession[] | undefined) => {
  if (!sessions?.length) return weeklyFocus;

  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const values = dayLabels.map((day) => ({ day, minutes: 0 }));

  sessions.forEach((session) => {
    const date = session.completedAtIso ? new Date(session.completedAtIso) : null;
    if (!date || Number.isNaN(date.getTime()) || date < start) return;
    values[date.getDay()].minutes += session.completedMinutes;
  });

  return values;
};

export const WeeklyFocusChart = ({ sessions }: WeeklyFocusChartProps) => {
  const focus = buildWeek(sessions);
  const maxMinutes = Math.max(1, ...focus.map((item) => item.minutes));
  const totalMinutes = focus.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Weekly focus</h2>
          <p className="mt-1 text-sm text-slate-400">{sessions?.length ? 'Synced from completed sessions' : 'Complete a session to build your week'}</p>
        </div>
        <span className="rounded-full bg-white/8 px-3 py-1 text-sm text-slate-300">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</span>
      </div>
      <div className="mt-6 flex h-52 items-end gap-3">
        {focus.map((item) => (
          <div key={item.day} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-40 w-full items-end rounded-md bg-black/40 p-1">
              <div
                className="w-full rounded-sm bg-gradient-to-t from-[#1ed760] to-[#a7f3d0]"
                style={{ height: `${Math.max(12, (item.minutes / maxMinutes) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-400">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
