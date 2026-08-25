import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, ...props }, ref) => {
  return (
    <label className="block w-full">
      {label ? <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          'h-12 w-full rounded-[14px] border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#22e26b]/70 focus:bg-white/[0.09] focus:ring-2 focus:ring-[#22e26b]/20',
          error ? 'border-rose-400/60' : '',
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </label>
  );
});

Input.displayName = 'Input';
