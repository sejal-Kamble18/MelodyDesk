import { GoalCard } from '../components/product/GoalCard';
import { SectionHeader } from '../components/product/SectionHeader';
import { SessionList } from '../components/product/SessionList';
import { StatisticCard } from '../components/product/StatisticCard';
import { WeeklyFocusChart } from '../components/product/WeeklyFocusChart';
import { activities, goals } from '../data/melodydesk';
import { useSessionStore } from '../store/sessionStore';

export const DashboardPage = () => {
  const history = useSessionStore((state) => state.history);
  const totalMinutes = history.reduce((sum, session) => sum + session.completedMinutes, 0);
  const mostUsedActivity = activities.find((activity) => activity.id === history[0]?.activity)?.name ?? 'Coding';

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Dashboard"
        title="Productivity analytics"
        description="Presentation-layer analytics for daily totals, weekly trends, activity mix, goals, and recent session persistence."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatisticCard label="Total saved focus" value={`${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m`} detail="Across persisted sessions" />
        <StatisticCard label="Today" value="3h 05m" detail="2 sessions completed" />
        <StatisticCard label="Most used activity" value={mostUsedActivity} detail="Based on recent history" />
        <StatisticCard label="Most used music" value="Lo-fi" detail="Provider and native mix" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <WeeklyFocusChart />
        <GoalCard goal={goals[1]} />
      </div>

      <SessionList sessions={history.slice(0, 5)} />
    </div>
  );
};
