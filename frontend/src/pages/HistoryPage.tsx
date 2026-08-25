import { useMemo, useState } from 'react';
import { SearchInput } from '../components/music/SearchInput';
import { EmptyState } from '../components/common/EmptyState';
import { SectionHeader } from '../components/product/SectionHeader';
import { SessionList } from '../components/product/SessionList';
import { activities } from '../data/melodydesk';
import { useSessionStore } from '../store/sessionStore';
import type { ActivityId } from '../types/product';

export const HistoryPage = () => {
  const history = useSessionStore((state) => state.history);
  const [query, setQuery] = useState('');
  const [activity, setActivity] = useState<ActivityId | 'all'>('all');

  const filtered = useMemo(
    () =>
      history.filter((session) => {
        const matchesActivity = activity === 'all' || session.activity === activity;
        const normalized = query.trim().toLowerCase();
        const matchesQuery = !normalized || [session.title, session.playlistName, session.customActivityName ?? ''].some((value) => value.toLowerCase().includes(normalized));
        return matchesActivity && matchesQuery;
      }),
    [activity, history, query],
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Session history"
        title="Every completed block"
        description="Filter saved focus sessions by activity, title, playlist, or custom notes-ready labels."
      />
      <SearchInput value={query} onChange={setQuery} placeholder="Search session history" />
      <div className="flex flex-wrap gap-2">
        <button className={`rounded-full px-4 py-2 text-sm font-bold ${activity === 'all' ? 'bg-white text-black' : 'bg-white/[0.06] text-zinc-300'}`} onClick={() => setActivity('all')} type="button">
          All
        </button>
        {activities.slice(0, 8).map((item) => (
          <button key={item.id} className={`rounded-full px-4 py-2 text-sm font-bold ${activity === item.id ? 'bg-white text-black' : 'bg-white/[0.06] text-zinc-300'}`} onClick={() => setActivity(item.id)} type="button">
            {item.name}
          </button>
        ))}
      </div>
      {filtered.length ? <SessionList sessions={filtered} /> : <EmptyState title="No sessions found" description="Try another activity filter or search term." />}
    </div>
  );
};
