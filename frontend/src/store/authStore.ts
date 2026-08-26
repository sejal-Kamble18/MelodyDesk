import { create } from 'zustand';
import type { AuthChangeEvent, Session, Subscription, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AuthUser, RegisterResult } from '../types/auth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  bootstrap: () => Promise<Subscription | null>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<RegisterResult>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getStringMetadata = (user: User, key: string) => {
  const value = user.user_metadata?.[key];
  return typeof value === 'string' ? value : undefined;
};

const mapUser = (user: User): AuthUser => {
  const email = user.email ?? '';
  const name = getStringMetadata(user, 'full_name') || getStringMetadata(user, 'name') || email.split('@')[0] || 'MelodyDesk User';
  return {
    id: user.id,
    name,
    email,
    role: 'Focus Builder',
    avatar: initials(name),
    isVerified: Boolean(user.email_confirmed_at),
  };
};

const readAuthError = (message: string | undefined, fallback: string) => {
  if (!message) return fallback;
  if (message.includes('Invalid login credentials')) return 'Email or password is incorrect.';
  if (message.includes('Email not confirmed')) return 'Please verify your email before signing in.';
  return message;
};

const passwordRedirectTo = () => `${window.location.origin}/reset-password`;

const requireSupabase = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
};

const throwAuthError = (set: (state: Partial<AuthState>) => void, message: string, cause?: unknown) => {
  set({ isLoading: false, error: message });
  throw new Error(message, { cause });
};

const ensureSupabase = (set: (state: Partial<AuthState>) => void) => {
  try {
    requireSupabase();
  } catch (error) {
    throwAuthError(set, error instanceof Error ? error.message : 'Supabase is not configured.', error);
  }
};

const applySession = (set: (state: Partial<AuthState>) => void, session: Session | null, event?: AuthChangeEvent) => {
  if (session?.user) {
    set({ user: mapUser(session.user), isAuthenticated: true, isLoading: false, error: null });
    return;
  }

  if (!event || event === 'SIGNED_OUT') {
    set({ user: null, isAuthenticated: false, isLoading: false });
  }
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  bootstrap: async () => {
    set({ isLoading: true });

    if (!isSupabaseConfigured) {
      set({ isLoading: false, error: 'Supabase environment variables are missing.' });
      return null;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      set({ user: null, isAuthenticated: false, isLoading: false, error: readAuthError(error.message, 'Unable to restore your session.') });
    } else {
      applySession(set, data.session);
      set((state) => ({ isLoading: false, isAuthenticated: Boolean(data.session), user: data.session ? state.user : null }));
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      applySession(set, session, event);
    });

    return listener.subscription;
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    ensureSupabase(set);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throwAuthError(set, readAuthError(error.message, 'Unable to sign in. Check your email and password.'), error);
    }
    applySession(set, data.session);
  },
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    ensureSupabase(set);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      throwAuthError(set, readAuthError(error.message, 'Unable to create your account.'), error);
    }

    applySession(set, data.session);
    set({ isLoading: false });
    return { needsEmailVerification: Boolean(data.user && !data.session) };
  },
  sendPasswordReset: async (email) => {
    set({ isLoading: true, error: null });
    ensureSupabase(set);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: passwordRedirectTo() });
    if (error) {
      throwAuthError(set, readAuthError(error.message, 'Unable to send a password reset link.'), error);
    }
    set({ isLoading: false });
  },
  updatePassword: async (password) => {
    set({ isLoading: true, error: null });
    ensureSupabase(set);
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      throwAuthError(set, readAuthError(error.message, 'Unable to update your password.'), error);
    }
    if (data.user) set({ user: mapUser(data.user), isAuthenticated: true });
    set({ isLoading: false });
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },
}));
