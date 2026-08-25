import { Link } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';

export const VerifyEmailPage = () => {
  return (
    <AuthShell
      title="Verify your email"
      subtitle="Email verification is represented as a clear frontend state and can be connected to the backend token endpoint."
      footer={
        <Link className="font-semibold text-white" to="/login">
          Back to sign in
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[#1ed760]/30 bg-[#1ed760]/10 p-4 text-sm leading-6 text-emerald-100">
          Verification link accepted locally. Backend integration should validate the token before signing the user in.
        </div>
        <Button className="w-full">
          <Link to="/login">Continue</Link>
        </Button>
      </div>
    </AuthShell>
  );
};
