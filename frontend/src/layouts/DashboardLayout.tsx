import type { ReactNode } from 'react';
import { Sidebar } from '../components/layout/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-40 lg:pb-32">
          <div className="mx-auto max-w-[1420px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <div className="min-h-[calc(100vh-9rem)] overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#17171a_0%,#0f0f11_42%,#090909_100%)] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:p-7 lg:p-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
