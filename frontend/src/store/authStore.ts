import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { authTokenStorage } from '../lib/api';
import type { AuthResponse, AuthUser, BackendUser, TokenResponse } from '../types/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (payload: AuthResponse) => void;
  clearAuth: () => void;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, organization: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const mapUser = (user: BackendUser): AuthUser => {
  const name = user.full_name || user.email.split('@')[0] || 'MelodyDesk User';
  return {
    id: user.id,
    name,
    email: user.email,
    role: 'Focus Builder',
    organization: 'MelodyDesk',
    avatar: initials(name),
    isVerified: user.is_verified,
  };
};

const readApiError = (error: unknown) => {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: { error?: { message?: string } }; message?: string } } }).response;
    return response?.data?.detail?.error?.message || response?.data?.message;
  }
  return undefined;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (payload) => {
        window.localStorage.setItem('melodydesk-token', payload.token);
        window.localStorage.setItem('melodydesk-refresh-token', payload.refreshToken);
        set({ user: payload.user, token: payload.token, refreshToken: payload.refreshToken, isAuthenticated: true, isLoading: false });
      },
      clearAuth: () => {
        authTokenStorage.clearTokens();
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false });
      },
      bootstrap: async () => {
        const token = window.localStorage.getItem('melodydesk-token');
        const refreshToken = window.localStorage.getItem('melodydesk-refresh-token');
        if (!token || !refreshToken) {
          get().clearAuth();
          return;
        }

        set({ isLoading: true, token, refreshToken });
        try {
          const response = await api.get<BackendUser>('/auth/me');
          set({ user: mapUser(response.data), token, refreshToken, isAuthenticated: true, isLoading: false });
        } catch {
          get().clearAuth();
        }
      },
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const tokenResponse = await api.post<TokenResponse>('/auth/login', { email, password });
          authTokenStorage.storeTokens(tokenResponse.data);
          const userResponse = await api.get<BackendUser>('/auth/me');
          get().setAuth({ user: mapUser(userResponse.data), token: tokenResponse.data.access_token, refreshToken: tokenResponse.data.refresh_token });
        } catch (error) {
          set({ isLoading: false });
          throw new Error(readApiError(error) || 'Unable to sign in. Check your email and password.', { cause: error });
        }
      },
      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          await api.post<BackendUser>('/auth/register', { email, password, full_name: name });
          await get().login(email, password);
        } catch (error) {
          set({ isLoading: false });
          throw new Error(readApiError(error) || 'Unable to create your account.', { cause: error });
        }
      },
      logout: async () => {
        const refreshToken = authTokenStorage.getRefreshToken();
        try {
          if (refreshToken) {
            await api.post('/auth/logout', { refresh_token: refreshToken });
          }
        } finally {
          get().clearAuth();
        }
      },
    }),
    {
      name: 'melodydesk-auth',
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
