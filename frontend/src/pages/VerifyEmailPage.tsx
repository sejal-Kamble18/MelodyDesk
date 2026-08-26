import { Link, useLocation } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const email = typeof location.state === 'object' && location.state && 'email' in location.state ? String(location.state.email) : null;

  return (
    <AuthShell
      title="Verify your email"
      subtitle={email ? `We sent a confirmation link to ${email}.` : 'Open the confirmation link from Supabase to finish creating your account.'}
      footer={
        <Link className="font-semibold text-white" to="/login">
          Back to sign in
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[#1ed760]/30 bg-[#1ed760]/10 p-4 text-sm leading-6 text-emerald-100">
          After confirming your email, return here and sign in with your password. If email confirmation is disabled, your account opens immediately.
        </div>
        <Button className="w-full">
          <Link to="/login">Continue</Link>
        </Button>
      </div>
    </AuthShell>
  );
};
