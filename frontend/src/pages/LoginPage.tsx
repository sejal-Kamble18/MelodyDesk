import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { loginSchema } from '../lib/validators';
import { useAuthStore } from '../store/authStore';
import type { LoginPayload } from '../types/auth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginPayload) => {
    setError(null);
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'We could not sign you in. Please try again.');
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to start focus sessions, choose music, and keep your history synced."
      footer={
        <>
          Do not have an account?{' '}
          <Link className="font-semibold text-white" to="/register">
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" placeholder="name@example.com" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" placeholder="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <div className="flex items-center justify-between text-sm">
          <Link className="text-slate-400 transition hover:text-white" to="/forgot-password">
            Forgot password?
          </Link>
          <Button type="submit" className="min-w-[140px]" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
};
