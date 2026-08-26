import { GoalCard } from '../components/product/GoalCard';
import { SessionList } from '../components/product/SessionList';
import { WeeklyFocusChart } from '../components/product/WeeklyFocusChart';
import { goals } from '../data/melodydesk';
import { useSessionStore } from '../store/sessionStore';

export const AnalyticsPage = () => {
  const history = useSessionStore((state) => state.history);
  const totalMinutes = history.reduce((sum, session) => sum + session.completedMinutes, 0);
  const completed = history.filter((session) => session.status === 'completed').length;
  const completionRate = history.length ? Math.round((completed / history.length) * 100) : 0;
  const longestSession = Math.max(0, ...history.map((session) => session.completedMinutes));
  const topSource = history[0]?.playlistName ?? 'No sessions yet';

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22e26b]">Analytics</p>
        <h1 className="mt-3 text-5xl font-black text-white">Listening-backed productivity</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">A lighter analytics surface focused on trends, momentum, and the listening patterns behind better sessions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Focus time', `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`],
          ['Completion rate', `${completionRate}%`],
          ['Top playlist', topSource],
          ['Longest session', `${longestSession}m`],
        ].map(([label, value]) => (
          <section key={label} className="rounded-[22px] border border-white/8 bg-[#111113] p-5">
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="mt-3 text-3xl font-black text-white">{value}</p>
          </section>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <WeeklyFocusChart sessions={history} />
        <GoalCard goal={{ ...goals[1], completedMinutes: totalMinutes }} />
      </div>
      <SessionList sessions={history.slice(0, 5)} />
    </div>
  );
};
