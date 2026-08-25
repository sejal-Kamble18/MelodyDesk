import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number;
  className?: string;
}

export const ProgressBar = ({ value, className }: ProgressBarProps) => {
  const width = `${Math.max(0, Math.min(100, value))}%`;

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-white/10', className)}>
      <div className="h-full rounded-full bg-[#1ed760] shadow-[0_0_16px_rgba(30,215,96,0.35)]" style={{ width }} />
    </div>
  );
};
