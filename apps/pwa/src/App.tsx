import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InternetRequired from '@/components/ui/InternetRequired';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SyncBar from '@/components/ui/SyncBar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useBackgroundRuntime } from '@/hooks/useBackgroundRuntime';
import { useHydrated } from '@/hooks/useHydrated';
import { useInternetGate } from '@/hooks/useInternetGate';
import { useLearnerStore } from '@/store/learnerStore';
import { refreshMe } from '@/lib/session';
import { scheduleCloudSync } from '@/lib/syncEngine';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SkillTreePage = lazy(() => import('@/pages/SkillTreePage'));
const LessonPlayerPage = lazy(() => import('@/pages/LessonPlayerPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ReviewPage = lazy(() => import('@/pages/ReviewPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const EducatorPage = lazy(() => import('@/pages/EducatorPage'));
const StudyLibraryPage = lazy(() => import('@/pages/StudyLibraryPage'));
const StudyArticlePage = lazy(() => import('@/pages/StudyArticlePage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const CoursePage = lazy(() => import('@/pages/CoursePage'));
const CurriculumStudioPage = lazy(() => import('@/pages/CurriculumStudioPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function App() {
  const hydrated = useHydrated();
  const { status: internetStatus, retry: retryInternet } = useInternetGate();
  const token = useLearnerStore((s) => s.token);
  const internetReady = internetStatus === 'online';
  useBackgroundRuntime();

  useEffect(() => {
    if (!hydrated || !internetReady || !token) return;
    void refreshMe().catch(() => undefined);
    scheduleCloudSync();
  }, [hydrated, internetReady, token]);

  if (!hydrated || internetStatus === 'checking') {
    return <LoadingSpinner fullScreen />;
  }

  if (internetStatus === 'offline') {
    return <InternetRequired onRetry={() => void retryInternet()} />;
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <SyncBar />
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/study" element={<StudyLibraryPage />} />
          <Route path="/study/:slug" element={<StudyArticlePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/learn"
            element={<ProtectedRoute />}
          >
            <Route index element={<Navigate to="/learn/skill-tree" replace />} />
            <Route path="skill-tree" element={<SkillTreePage />} />
            <Route path="course/:pathId" element={<CoursePage />} />
            <Route path="lesson/:lessonId" element={<LessonPlayerPage />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
          </Route>
          <Route
            path="/onboard"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/curriculum"
            element={
              <ProtectedRoute>
                <CurriculumStudioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/educator"
            element={
              <ProtectedRoute>
                <EducatorPage />
              </ProtectedRoute>
            }
          />
          <Route path="/office" element={<AdminPage />} />
          <Route path="/admin" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}
