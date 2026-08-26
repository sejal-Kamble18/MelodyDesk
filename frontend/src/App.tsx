import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';
import { useSessionStore } from './store/sessionStore';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    },
  },
});

function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadRemoteData = useSessionStore((state) => state.loadRemoteData);
  const clearUserData = useSessionStore((state) => state.clearUserData);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    void bootstrap().then((subscription) => {
      unsubscribe = () => subscription?.unsubscribe();
    });

    const handleExpired = () => {
      window.location.assign('/login');
    };

    window.addEventListener('auth:expired', handleExpired);
    return () => {
      unsubscribe?.();
      window.removeEventListener('auth:expired', handleExpired);
    };
  }, [bootstrap]);

  useEffect(() => {
    if (isAuthenticated) {
      void loadRemoteData();
    } else {
      clearUserData();
    }
  }, [clearUserData, isAuthenticated, loadRemoteData]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
