import type { Goal } from '../../types/product';
import { Card } from '../ui/Card';
import { ProgressBar } from './ProgressBar';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const progress = Math.round((goal.completedMinutes / goal.targetMinutes) * 100);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-white">{goal.label}</p>
          <p className="mt-1 text-sm text-slate-400">{goal.period}</p>
        </div>
        <span className="rounded-full bg-[#1ed760]/12 px-3 py-1 text-sm font-bold text-[#1ed760]">{progress}%</span>
      </div>
      <ProgressBar value={progress} className="mt-5" />
      <p className="mt-3 text-sm text-slate-400">
        {goal.completedMinutes} of {goal.targetMinutes} minutes
      </p>
    </Card>
  );
};
