import { GoalCard } from '../components/product/GoalCard';
import { SectionHeader } from '../components/product/SectionHeader';
import { goals } from '../data/melodydesk';

export const GoalsPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Goals"
        title="Focus targets and streaks"
        description="Daily, weekly, and monthly goals mirror the backend goal model from the architecture report."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
        <h2 className="text-xl font-bold text-white">Streak plan</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-7">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className={`rounded-md p-4 text-center ${index < 5 ? 'bg-[#1ed760] text-black' : 'bg-black/35 text-slate-400'}`}>
              <p className="text-sm font-black">{day}</p>
              <p className="mt-2 text-xs font-bold">{index < 5 ? 'Done' : 'Open'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
