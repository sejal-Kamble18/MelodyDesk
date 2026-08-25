import { SectionHeader } from '../components/product/SectionHeader';
import { useAuthStore } from '../store/authStore';

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Profile" title="Your MelodyDesk account" description="Account details are ready for the backend user profile endpoint." />
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1ed760] text-3xl font-black text-black">
            {user?.avatar ?? 'MD'}
          </div>
          <h2 className="mt-5 text-2xl font-black text-white">{user?.name ?? 'MelodyDesk User'}</h2>
          <p className="mt-1 text-sm text-slate-400">{user?.email ?? 'user@example.com'}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#181818] p-5">
          <h2 className="text-xl font-bold text-white">Profile fields</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ['Role', user?.role ?? 'Focus Builder'],
              ['Organization', user?.organization ?? 'MelodyDesk'],
              ['Email verification', 'Pending backend verification'],
              ['Account sync', 'Local demo state active'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md bg-black/35 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-1 font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
