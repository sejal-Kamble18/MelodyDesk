import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return <div className={cn('rounded-[18px] border border-white/8 bg-[#111113] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]', className)}>{children}</div>;
};
