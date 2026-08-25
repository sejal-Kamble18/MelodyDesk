import type { ReactNode } from 'react';

interface HorizontalScrollerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const HorizontalScroller = ({ title, subtitle, children }: HorizontalScrollerProps) => {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
        </div>
      </div>
      <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">{children}</div>
    </section>
  );
};
