import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { resetPasswordSchema } from '../lib/validators';
import { useAuthStore } from '../store/authStore';
import type { ResetPasswordPayload } from '../types/auth';

export const ResetPasswordPage = () => {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePassword, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordPayload>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordPayload) => {
    setError(null);
    try {
      await updatePassword(values.password);
      setDone(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to reset your password.');
    }
  };

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Enter a new password after opening the recovery link from your email."
      footer={
        <Link className="font-semibold text-white" to="/login">
          Back to sign in
        </Link>
      }
    >
      {done ? (
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          Password reset complete. You can sign in with the new password.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="New password" type="password" autoComplete="new-password" placeholder="password" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm password" type="password" autoComplete="new-password" placeholder="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? 'Resetting...' : 'Reset password'}
          </Button>
        </form>
      )}
    </AuthShell>
  );
};
