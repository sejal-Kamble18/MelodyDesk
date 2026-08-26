import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Disc3 } from 'lucide-react';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => (
  <div className="min-h-screen bg-[#060607] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
    <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-[#101113] shadow-[0_35px_120px_rgba(0,0,0,0.55)] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative flex flex-col justify-between overflow-hidden p-8 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,226,107,0.22),transparent_30%),linear-gradient(145deg,#15171a_0%,#090a0b_68%)]" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3 text-sm font-black text-white">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#22e26b] text-black shadow-[0_16px_48px_rgba(34,226,107,0.22)]">
              <Disc3 size={21} />
            </span>
            MelodyDesk
          </Link>
          <div className="mt-14 max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#22e26b]">Secure focus workspace</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 text-base leading-7 text-zinc-300">{subtitle}</p>
          </div>
        </div>

        <div className="relative mt-12 grid gap-3 sm:grid-cols-3">
          {['Timer', 'Music', 'History'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-sm font-bold text-white">{item}</p>
              <p className="mt-1 text-xs text-zinc-400">Synced</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#151619] p-5 sm:p-8 lg:p-10">
        <div className="w-full max-w-md rounded-[22px] border border-white/10 bg-[#0b0c0e] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.42)] sm:p-8">
          {children}
          <div className="mt-6 text-center text-sm text-zinc-400">{footer}</div>
        </div>
      </div>
    </div>
  </div>
);
