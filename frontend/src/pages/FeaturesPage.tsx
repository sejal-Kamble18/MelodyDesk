import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/product/SectionHeader';
import { Button } from '../components/ui/Button';

const features = [
  ['Session engine', 'Pomodoro, custom timer, free listening, pause, resume, reset, and finish early.'],
  ['Music layer', 'Provider-ready playback states plus native focus sounds and silent sessions.'],
  ['Analytics', 'Daily, weekly, streak, goal, activity, and recent-session views.'],
  ['Account area', 'Auth forms, protected routes, profile, preferences, and connected accounts.'],
];

export const FeaturesPage = () => {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <SectionHeader
          eyebrow="Features"
          title="Simple dark focus workspace"
          description="MelodyDesk is built as a productivity frontend with music-provider-safe playback surfaces."
          action={
            <Button>
              <Link to="/register">Start</Link>
            </Button>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          {features.map(([title, body]) => (
            <section key={title} className="rounded-lg border border-white/10 bg-[#181818] p-5">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};
