import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnerStore } from '@/store/learnerStore';
import { IDLE_SESSION_MS } from '@/lib/sessionSecurity';

export function useAutoLogout() {
  const navigate = useNavigate();
  const token = useLearnerStore((s) => s.token);
  const touchSession = useLearnerStore((s) => s.touchSession);
  const reset = useLearnerStore((s) => s.reset);
  const lastTouchRef = useRef<number>(Date.now());

  // Throttled user activity tracker
  useEffect(() => {
    if (!token) return;

    const onUserActivity = () => {
      const now = Date.now();
      // Throttle store updates to once every 10 seconds
      if (now - lastTouchRef.current > 10_000) {
        lastTouchRef.current = now;
        touchSession();
      }
    };

    const events: Array<keyof WindowEventMap> = [
      'pointerdown',
      'keydown',
      'touchstart',
      'scroll',
      'wheel',
    ];

    for (const evt of events) {
      window.addEventListener(evt, onUserActivity, { passive: true });
    }

    return () => {
      for (const evt of events) {
        window.removeEventListener(evt, onUserActivity);
      }
    };
  }, [token, touchSession]);

  // Periodic and visibility-based inactivity validator
  useEffect(() => {
    if (!token) return;

    const checkInactivity = () => {
      const state = useLearnerStore.getState();
      if (!state.token) return;

      const lastActive = state.lastActiveAt || lastTouchRef.current;
      const now = Date.now();

      if (now - lastActive >= IDLE_SESSION_MS) {
        // Auto-logout: clear active session and route to landing page
        reset();
        navigate('/?logged_out=inactivity', {
          replace: true,
          state: { loggedOutDueToInactivity: true },
        });
      }
    };

    // Check every 10 seconds
    const interval = window.setInterval(checkInactivity, 10_000);

    // Also check immediately when the browser tab becomes active again
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkInactivity();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [token, reset, navigate]);
}
