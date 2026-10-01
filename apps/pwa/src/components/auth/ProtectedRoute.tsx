import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useHydrated } from '@/hooks/useHydrated';
import { isEducator, isStaff } from '@/lib/localAccounts';
import { useLearnerStore } from '@/store/learnerStore';
import { useModerationStore } from '@/store/moderationStore';

export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const hydrated = useHydrated();
  const token = useLearnerStore((state) => state.token);
  const isGuest = useLearnerStore((state) => state.isGuest);
  const valid = useLearnerStore((state) =>
    Boolean(state.token && !state.isGuest && state.isSessionValid())
  );
  const onboarded = useLearnerStore((state) => state.onboardingCompleted);
  const email = useLearnerStore((state) => state.email);
  const approvedEducator = useModerationStore((state) =>
    state.applications.some(
      (item) => item.email.toLowerCase() === (email ?? '').toLowerCase() && item.status === 'approved'
    )
  );
  const teaching = !isStaff(email) && (isEducator(email) || approvedEducator);

  useEffect(() => {
    if (hydrated && token && !isGuest && !valid) {
      useLearnerStore.getState().lockSession();
    }
  }, [hydrated, token, isGuest, valid]);

  if (!hydrated) {
    return <LoadingSpinner fullScreen />;
  }

  if (!token || isGuest || !valid) {
    if (token && !valid) {
      return <Navigate to="/?logged_out=inactivity" replace />;
    }
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  const learnerOnly =
    location.pathname.startsWith('/learn/lesson') ||
    location.pathname.startsWith('/learn/review') ||
    location.pathname.startsWith('/learn/leaderboard') ||
    location.pathname.startsWith('/onboard') ||
    location.pathname.startsWith('/curriculum');
  if (teaching && learnerOnly) {
    return <Navigate to="/educator" replace />;
  }

  const skipOnboard =
    location.pathname.startsWith('/onboard') ||
    location.pathname.startsWith('/curriculum') ||
    location.pathname.startsWith('/educator');
  if (!onboarded && !skipOnboard) {
    return <Navigate to="/onboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
