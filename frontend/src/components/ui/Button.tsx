import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22e26b]/50 disabled:cursor-not-allowed disabled:opacity-60';
    const variants = {
      primary: 'bg-[#22e26b] text-black shadow-[0_14px_44px_rgba(34,226,107,0.22)] hover:bg-[#35f27b]',
      secondary: 'border border-white/10 bg-white/[0.07] text-zinc-100 hover:bg-white/[0.11]',
      ghost: 'bg-transparent text-zinc-300 hover:bg-white/[0.08] hover:text-white',
      danger: 'border border-rose-400/30 bg-rose-500/10 text-rose-100 hover:bg-rose-500/18',
    };
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-sm',
      lg: 'h-12 px-5 text-base',
    };

    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
