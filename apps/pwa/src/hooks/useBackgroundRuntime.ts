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
  }, [hydrated]);
}
