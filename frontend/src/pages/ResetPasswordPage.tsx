import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const ResetPasswordPage = () => {
  const [done, setDone] = useState(false);

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="This page is ready for the backend reset-token flow."
      footer={
        <Link className="font-semibold text-white" to="/login">
          Back to sign in
        </Link>
      }
    >
      {done ? (
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          Password reset confirmed locally. Connect the API to persist it.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); setDone(true); }}>
          <Input label="New password" type="password" autoComplete="new-password" placeholder="password" />
          <Input label="Confirm password" type="password" autoComplete="new-password" placeholder="password" />
          <Button className="w-full" type="submit">Reset password</Button>
        </form>
      )}
    </AuthShell>
  );
};
