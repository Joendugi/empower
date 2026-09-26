import { useEffect } from 'react';
import { registerBackgroundSync, scheduleCloudSync } from '@/lib/syncEngine';
import { useHydrated } from '@/hooks/useHydrated';
import { useLearnerStore } from '@/store/learnerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useSyncStore } from '@/store/syncStore';

export function useBackgroundRuntime() {
  const hydrated = useHydrated();
  const token = useLearnerStore((state) => state.token);

  useEffect(() => {
    if (!hydrated) return;
    useLearnerStore.getState().touchSession();
    void useLibraryStore.getState().hydrate();
    void registerBackgroundSync();
    scheduleCloudSync();
  }, [hydrated, token]);

  useEffect(() => {
    if (!hydrated) return;
    const touch = () => useLearnerStore.getState().touchSession();
    const onOnline = () => {
      useSyncStore.getState().setStatus('syncing');
      scheduleCloudSync();
    };
    const onOffline = () => useSyncStore.getState().setStatus('offline');
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        touch();
        scheduleCloudSync();
      }
    };
    const report = (message: string, path?: string) => {
      void import('@/lib/api').then(({ api }) =>
        api('/ops/errors', {
          method: 'POST',
          body: JSON.stringify({ message: message.slice(0, 500), path }),
        }).catch(() => undefined)
      );
    };
    const onError = (event: ErrorEvent) => report(event.message, window.location.pathname);
    const onRejection = (event: PromiseRejectionEvent) =>
      report(event.reason instanceof Error ? event.reason.message : String(event.reason), window.location.pathname);
    window.addEventListener('pointerdown', touch, { passive: true });
    window.addEventListener('keydown', touch);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('pointerdown', touch);
      window.removeEventListener('keydown', touch);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, [hydrated]);
}
