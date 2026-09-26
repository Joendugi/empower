import { useEffect } from 'react';
import { registerBackgroundSync, scheduleCloudSync } from '@/lib/syncEngine';
import { useHydrated } from '@/hooks/useHydrated';
import { useLearnerStore } from '@/store/learnerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useSyncStore } from '@/store/syncStore';

async function syncActiveCoursePacks() {
  await useLibraryStore.getState().hydrate();
  const chosen = useLearnerStore.getState().chosenPathIds;
  useLibraryStore.getState().syncActiveProgrammes(chosen);
}

/** Background sync / pack hydrate — only after the web internet gate admits the session. */
export function useBackgroundRuntime(enabled = true) {
  const hydrated = useHydrated();
  const token = useLearnerStore((state) => state.token);
  const chosenPathIds = useLearnerStore((state) => state.chosenPathIds);
  const ready = hydrated && enabled;

  useEffect(() => {
    if (!ready) return;
    useLearnerStore.getState().touchSession();
    void syncActiveCoursePacks();
    void registerBackgroundSync();
    scheduleCloudSync();
  }, [ready, token, chosenPathIds]);

  useEffect(() => {
    if (!ready) return;
    const touch = () => useLearnerStore.getState().touchSession();
    const onOnline = () => {
      useSyncStore.getState().setStatus('syncing');
      void syncActiveCoursePacks();
      scheduleCloudSync();
    };
    const onOffline = () => useSyncStore.getState().setStatus('offline');
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        touch();
        void syncActiveCoursePacks();
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
