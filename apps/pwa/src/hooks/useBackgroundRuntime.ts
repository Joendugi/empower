import { useEffect } from 'react';
import { registerBackgroundSync, scheduleCloudSync } from '@/lib/syncEngine';
import { useHydrated } from '@/hooks/useHydrated';
import { useLearnerStore } from '@/store/learnerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useSyncStore } from '@/store/syncStore';

/** Background sync / pack hydrate — only after the web internet gate admits the session. */
export function useBackgroundRuntime(enabled = true) {
  const hydrated = useHydrated();
  const token = useLearnerStore((state) => state.token);
  const ready = hydrated && enabled;

  useEffect(() => {
    if (!ready) return;
    useLearnerStore.getState().touchSession();
    void useLibraryStore.getState().hydrate();
    void registerBackgroundSync();
    scheduleCloudSync();
  }, [ready, token]);

  useEffect(() => {
    if (!ready) return;
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
    window.addEventListener('pointerdown', touch, { passive: true });
    window.addEventListener('keydown', touch);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('pointerdown', touch);
      window.removeEventListener('keydown', touch);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [ready]);
}
