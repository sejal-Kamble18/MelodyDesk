import { Link, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const features = [
  'Activity-based focus sessions',
  'Pomodoro, custom timer, and free listening',
  'Native focus sounds when a provider is unavailable',
  'Goals, streaks, history, and analytics',
];

export const LandingPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-6">
        <nav className="flex items-center justify-between">
          <Link className="text-2xl font-black" to="/">
            MelodyDesk
          </Link>
          <div className="flex items-center gap-3">
            <Link className="text-sm font-semibold text-slate-300 hover:text-white" to="/music-disclosure">
              Music policy
            </Link>
            <Link className="text-sm font-semibold text-slate-300 hover:text-white" to="/features">
              Features
            </Link>
            <Button className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </nav>

        <div className="grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#1ed760]">Focus, work, and move</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none text-white sm:text-7xl">
              Your focus desk with music that stays licensed.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              MelodyDesk combines protected productivity sessions, native focus audio, analytics, goals, and safe provider-ready playback states.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg">
                <Link to="/register">Create account</Link>
              </Button>
              <Button variant="secondary" size="lg">
                <Link to="/login">Try demo login</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#121212] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className="aspect-square rounded-md bg-gradient-to-br from-[#1ed760] via-[#0f7c3a] to-black p-5">
              <div className="flex h-full flex-col justify-between rounded-md bg-black/35 p-5 backdrop-blur">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-100">Now focusing</p>
                  <p className="mt-4 text-4xl font-black">25:00</p>
                  <p className="mt-2 text-sm text-emerald-100">Coding | Deep Code Current</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['Study', 'Coding', 'Design'].map((item) => (
                    <div key={item} className="rounded-md bg-black/50 p-3 text-sm font-bold">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 pb-10 md:grid-cols-4">
          {features.map((feature) => (
            <div key={feature} className="rounded-lg border border-white/10 bg-[#121212] p-4 text-sm font-semibold text-slate-200">
              {feature}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
