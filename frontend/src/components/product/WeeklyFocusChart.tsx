import { weeklyFocus } from '../../data/melodydesk';

export const WeeklyFocusChart = () => {
  const maxMinutes = Math.max(...weeklyFocus.map((item) => item.minutes));

  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Weekly focus</h2>
          <p className="mt-1 text-sm text-slate-400">Backend-ready analytics preview</p>
        </div>
        <span className="rounded-full bg-white/8 px-3 py-1 text-sm text-slate-300">15h 30m</span>
      </div>
      <div className="mt-6 flex h-52 items-end gap-3">
        {weeklyFocus.map((item) => (
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
