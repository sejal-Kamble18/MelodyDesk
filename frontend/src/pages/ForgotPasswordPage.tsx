import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { forgotPasswordSchema } from '../lib/validators';
import { useAuthStore } from '../store/authStore';

export const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendPasswordReset, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: { email: string }) => {
    setError(null);
    try {
      await sendPasswordReset(values.email);
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to send the reset link.');
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We will send a secure reset link to the email associated with your account."
      footer={
        <Link className="font-semibold text-white" to="/login">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
          If that account exists, we have sent a recovery link to your inbox.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" placeholder="name@example.com" autoComplete="email" error={errors.email?.message} {...register('email')} />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthShell>
  );
};
