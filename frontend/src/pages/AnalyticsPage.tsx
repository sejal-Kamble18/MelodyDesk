import { GoalCard } from '../components/product/GoalCard';
import { SessionList } from '../components/product/SessionList';
import { WeeklyFocusChart } from '../components/product/WeeklyFocusChart';
import { goals } from '../data/melodydesk';
import { useSessionStore } from '../store/sessionStore';

export const AnalyticsPage = () => {
  const history = useSessionStore((state) => state.history);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#22e26b]">Analytics</p>
        <h1 className="mt-3 text-5xl font-black text-white">Listening-backed productivity</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">A lighter analytics surface focused on trends, momentum, and the listening patterns behind better sessions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Focus time', '15h 30m'],
          ['Completion rate', '91%'],
          ['Most productive', 'Evening'],
          ['Longest streak', '18 days'],
        ].map(([label, value]) => (
          <section key={label} className="rounded-[22px] border border-white/8 bg-[#111113] p-5">
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="mt-3 text-3xl font-black text-white">{value}</p>
          </section>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <WeeklyFocusChart />
        <GoalCard goal={goals[1]} />
      </div>
      <SessionList sessions={history.slice(0, 5)} />
    </div>
  );
};
