import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/product/SectionHeader';
import { Button } from '../components/ui/Button';

interface LegalPageProps {
  kind: 'privacy' | 'terms' | 'music';
}

const copy = {
  privacy: {
    title: 'Privacy Policy',
    description: 'MelodyDesk should collect only the account, preference, session, and analytics data needed to run the product.',
  },
  terms: {
    title: 'Terms of Service',
    description: 'Users are responsible for using connected music providers according to provider rules and local law.',
  },
  music: {
    title: 'Music Provider Disclosure',
    description: 'MelodyDesk does not copy, download, proxy, or host commercial songs. Licensed providers remain responsible for catalog rights and playback.',
  },
};

export const LegalPage = ({ kind }: LegalPageProps) => {
  const content = copy[kind];

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <SectionHeader eyebrow="Legal" title={content.title} description={content.description} />
        <div className="rounded-lg border border-white/10 bg-[#181818] p-5 text-sm leading-7 text-slate-300">
          This frontend includes production-ready placeholder content for the MVP. Final legal text should be reviewed before deployment.
          The product architecture keeps commercial music with authorized providers and stores only account, preference, goal, session, and provider-reference data.
        </div>
        <Button variant="secondary">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
};
