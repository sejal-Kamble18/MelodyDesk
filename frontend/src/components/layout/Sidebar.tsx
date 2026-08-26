import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Disc3,
  Goal,
  History,
  Home,
  Library,
  ListMusic,
  LogOut,
  Search,
  Settings,
  Timer,
  User,
  UsersRound,
} from 'lucide-react';
import { MusicPlayer } from '../product/MusicPlayer';
import { IconButton } from '../common/IconButton';
import { useAuthStore } from '../../store/authStore';
import { useSessionStore } from '../../store/sessionStore';
import { cn } from '../../utils/cn';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/playlists', label: 'Playlists', icon: ListMusic },
  { to: '/focus', label: 'Focus Sessions', icon: Timer },
  { to: '/history', label: 'History', icon: History },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/goals', label: 'Goals', icon: Goal },
  { to: '/rooms', label: 'Study Rooms', icon: UsersRound },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const mobileItems = navItems.slice(0, 5);

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const activeSession = useSessionStore((state) => state.activeSession);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <aside
        className={cn(
          'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/8 bg-[#0b0b0d] px-3 py-4 transition-[width] duration-200 lg:flex',
          collapsed ? 'w-[92px]' : 'w-80',
        )}
      >
        <div className="flex items-center justify-between gap-3 px-2">
          <button className="flex min-w-0 items-center gap-3 text-left" onClick={() => navigate('/')} type="button">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] bg-[#22e26b] text-black shadow-[0_16px_45px_rgba(34,226,107,0.18)]">
              <Disc3 size={24} />
            </span>
            {!collapsed ? (
              <span className="min-w-0">
                <span className="block truncate text-xl font-black text-white">MelodyDesk</span>
                <span className="block truncate text-xs text-zinc-500">Music for focused momentum</span>
              </span>
            ) : null}
          </button>
          <IconButton aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </IconButton>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-bold transition duration-200',
                    isActive ? 'bg-white text-black' : 'text-zinc-400 hover:bg-white/[0.07] hover:text-white',
                    collapsed ? 'justify-center' : '',
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!collapsed ? <span>{item.label}</span> : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          {activeSession ? (
            <button
              className={cn(
                'w-full rounded-[20px] border border-[#22e26b]/20 bg-[#22e26b]/10 p-4 text-left transition hover:bg-[#22e26b]/15',
                collapsed ? 'px-3' : '',
              )}
              onClick={() => navigate('/focus/active')}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22e26b] text-black">
                  <Clock3 size={18} />
                </span>
                {!collapsed ? (
                  <span className="min-w-0">
                    <span className="block text-xs font-black uppercase tracking-[0.18em] text-[#22e26b]">Live focus</span>
                    <span className="mt-1 block truncate text-sm font-bold text-white">{activeSession.title}</span>
                  </span>
                ) : null}
              </div>
            </button>
          ) : null}

          <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-3">
            <button className="flex w-full items-center gap-3 text-left" onClick={() => navigate('/profile')} type="button">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-black">
                <User size={18} />
              </span>
              {!collapsed ? (
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-white">{user?.name ?? 'Student'}</span>
                  <span className="block truncate text-xs text-zinc-500">{user?.email ?? 'focus@melodydesk.app'}</span>
                </span>
              ) : null}
            </button>
            {!collapsed ? (
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2 text-sm font-bold text-zinc-400 transition hover:bg-white/8 hover:text-white" onClick={handleLogout} type="button">
                <LogOut size={16} />
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-[86px] z-30 grid grid-cols-5 gap-1 rounded-[22px] border border-white/10 bg-[#0b0b0d]/95 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn('flex flex-col items-center gap-1 rounded-[16px] px-2 py-2 text-[11px] font-bold transition', isActive ? 'bg-white text-black' : 'text-zinc-400')
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <MusicPlayer />
    </>
  );
};
