import { Suspense, lazy, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Spinner } from '../components/ui/Spinner';
import { useAuthStore } from '../store/authStore';

const LoginPage = lazy(() => import('../pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('../pages/VerifyEmailPage').then((module) => ({ default: module.VerifyEmailPage })));
const HomePage = lazy(() => import('../pages/HomePage').then((module) => ({ default: module.HomePage })));
const DiscoverPage = lazy(() => import('../pages/DiscoverPage').then((module) => ({ default: module.DiscoverPage })));
const SearchPage = lazy(() => import('../pages/SearchPage').then((module) => ({ default: module.SearchPage })));
const LibraryPage = lazy(() => import('../pages/LibraryPage').then((module) => ({ default: module.LibraryPage })));
const SavedPlaylistsPage = lazy(() => import('../pages/SavedPlaylistsPage').then((module) => ({ default: module.SavedPlaylistsPage })));
const PlaylistDetailPage = lazy(() => import('../pages/PlaylistDetailPage').then((module) => ({ default: module.PlaylistDetailPage })));
const CreateSessionPage = lazy(() => import('../pages/CreateSessionPage').then((module) => ({ default: module.CreateSessionPage })));
const ActiveSessionPage = lazy(() => import('../pages/ActiveSessionPage').then((module) => ({ default: module.ActiveSessionPage })));
const HistoryPage = lazy(() => import('../pages/HistoryPage').then((module) => ({ default: module.HistoryPage })));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })));
const GoalsPage = lazy(() => import('../pages/GoalsPage').then((module) => ({ default: module.GoalsPage })));
const StudyRoomsPage = lazy(() => import('../pages/StudyRoomsPage').then((module) => ({ default: module.StudyRoomsPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const LegalPage = lazy(() => import('../pages/LegalPage').then((module) => ({ default: module.LegalPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#070707]">
    <Spinner />
  </div>
);

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const ProtectedPage = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<PublicOnlyRoute><VerifyEmailPage /></PublicOnlyRoute>} />
        <Route path="/privacy" element={<LegalPage kind="privacy" />} />
        <Route path="/terms" element={<LegalPage kind="terms" />} />
        <Route path="/music-disclosure" element={<LegalPage kind="music" />} />

        <Route path="/" element={<ProtectedPage><HomePage /></ProtectedPage>} />
        <Route path="/discover" element={<ProtectedPage><DiscoverPage /></ProtectedPage>} />
        <Route path="/search" element={<ProtectedPage><SearchPage /></ProtectedPage>} />
        <Route path="/library" element={<ProtectedPage><LibraryPage /></ProtectedPage>} />
        <Route path="/playlists" element={<ProtectedPage><SavedPlaylistsPage /></ProtectedPage>} />
        <Route path="/playlists/:playlistId" element={<ProtectedPage><PlaylistDetailPage /></ProtectedPage>} />
        <Route path="/focus" element={<ProtectedPage><CreateSessionPage /></ProtectedPage>} />
        <Route path="/focus/active" element={<ProtectedPage><ActiveSessionPage /></ProtectedPage>} />
        <Route path="/history" element={<ProtectedPage><HistoryPage /></ProtectedPage>} />
        <Route path="/analytics" element={<ProtectedPage><AnalyticsPage /></ProtectedPage>} />
        <Route path="/goals" element={<ProtectedPage><GoalsPage /></ProtectedPage>} />
        <Route path="/rooms" element={<ProtectedPage><StudyRoomsPage /></ProtectedPage>} />
        <Route path="/settings" element={<ProtectedPage><SettingsPage /></ProtectedPage>} />
        <Route path="/profile" element={<ProtectedPage><ProfilePage /></ProtectedPage>} />
        <Route path="/connected-accounts" element={<Navigate to="/settings" replace />} />

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/music" element={<Navigate to="/discover" replace />} />
        <Route path="/dashboard" element={<Navigate to="/analytics" replace />} />
        <Route path="/create-session" element={<Navigate to="/focus" replace />} />
        <Route path="/active-session" element={<Navigate to="/focus/active" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
