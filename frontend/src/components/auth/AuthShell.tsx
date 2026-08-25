import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => {
  return (
    <div className="min-h-screen bg-[#050505] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-[#121212] shadow-[0_35px_120px_rgba(0,0,0,0.55)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between bg-gradient-to-br from-[#1ed760]/18 via-[#121212] to-black p-8 sm:p-10 lg:p-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 text-sm font-black text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1ed760] text-base text-black">M</span>
              MelodyDesk
            </Link>
            <div className="mt-12 max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1ed760]">Secure focus account</p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">{title}</h1>
              <p className="mt-4 text-base leading-7 text-slate-300">{subtitle}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {['Pomodoro', 'Music', 'Goals'].map((item) => (
              <div key={item} className="rounded-md bg-black/35 p-4">
                <p className="text-sm font-bold text-white">{item}</p>
                <p className="mt-1 text-xs text-slate-400">MVP ready</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-[#181818] p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#0f0f0f] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.4)] sm:p-8">
            {children}
            <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
