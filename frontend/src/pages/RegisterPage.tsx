import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { registerSchema } from '../lib/validators';
import { useAuthStore } from '../store/authStore';
import type { RegisterPayload } from '../types/auth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterPayload) => {
    setError(null);
    try {
      const result = await registerUser(values.name, values.email, values.password);
      navigate(result.needsEmailVerification ? '/verify-email' : '/', { state: { email: values.email } });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'We could not create your account. Please try again.');
    }
  };

  return (
    <AuthShell
      title="Create your focus desk"
      subtitle="Set up secure access for sessions, preferences, goals, and music provider connections."
      footer={
        <>
          Already have an account?{' '}
          <Link className="font-semibold text-white" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" type="text" placeholder="Ava Chen" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="name@example.com" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" placeholder="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  );
};
