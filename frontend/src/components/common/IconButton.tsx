import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
}

export const IconButton = ({ children, className, active = false, ...props }: IconButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22e26b]/50 disabled:cursor-not-allowed disabled:opacity-50',
        active ? 'bg-[#22e26b]/15 text-[#22e26b]' : '',
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};
