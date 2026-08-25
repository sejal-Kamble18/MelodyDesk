import { BookOpen, Brain, Briefcase, Code2, Dumbbell, Feather, PenTool, Sparkles, type LucideIcon } from 'lucide-react';
import type { Activity, ActivityId } from '../../types/product';
import { cn } from '../../utils/cn';

interface ActivityCardProps {
  activity: Activity;
  selected?: boolean;
  onSelect?: () => void;
}

const icons: Record<ActivityId, LucideIcon> = {
  coding: Code2,
  study: Brain,
  work: Briefcase,
  reading: BookOpen,
  writing: Feather,
  design: PenTool,
  workout: Dumbbell,
  meditation: Sparkles,
  custom: Sparkles,
};

export const ActivityCard = ({ activity, selected = false, onSelect }: ActivityCardProps) => {
  const Icon = icons[activity.id];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group flex min-h-40 flex-col items-start justify-between rounded-[20px] border p-4 text-left transition duration-200 hover:-translate-y-0.5',
        selected
          ? 'border-[#22e26b]/60 bg-[#22e26b]/12 shadow-[0_18px_60px_rgba(34,226,107,0.08)]'
          : 'border-white/8 bg-white/[0.04] hover:border-white/16 hover:bg-white/[0.07]',
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-black/35 text-[#22e26b]">
        <Icon size={22} />
      </span>
      <span>
        <span className="block text-lg font-black text-white">{activity.name}</span>
        <span className="mt-1 block text-sm leading-5 text-zinc-400">{activity.description}</span>
      </span>
    </button>
  );
};
