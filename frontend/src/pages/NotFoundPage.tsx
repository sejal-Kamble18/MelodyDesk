import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-10 text-slate-100">
      <div className="max-w-md rounded-lg border border-white/10 bg-[#181818] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#1ed760]">404</p>
        <h1 className="mt-3 text-4xl font-black text-white">Page not found</h1>
        <p className="mt-3 text-sm text-slate-400">The destination you requested does not exist or has moved.</p>
        <Link to="/" className="mt-6 inline-flex">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  );
};
