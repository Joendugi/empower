import { api, ApiError } from '@/lib/api';
import { listQueue, removeFromQueue } from '@/lib/idbQueue';
import { isLocalToken } from '@/lib/localApi';
import { yieldToUi } from '@/lib/sessionSecurity';
import { useLearnerStore } from '@/store/learnerStore';
import { usePlatformStore } from '@/store/platformStore';
import { useSyncStore } from '@/store/syncStore';

let flushing = false;
let scheduled = false;

async function refreshPending() {
  try {
    const items = await listQueue();
    useSyncStore.getState().setPending(items.length);
  } catch {
    useSyncStore.getState().setPending(0);
  }
}

async function pullCloudProgress() {
  const token = useLearnerStore.getState().token;
  if (!token || isLocalToken(token)) return;
  const remote = await api<{ completedLessonIds: string[]; nodeCompletion?: Record<string, number> }>(
    '/progress/me'
  );
  const store = useLearnerStore.getState();
  for (const lessonId of remote.completedLessonIds ?? []) {
    store.markLessonComplete(lessonId);
  }
}

async function flushQueue() {
  const token = useLearnerStore.getState().token;
  if (!token || isLocalToken(token)) return;
  const items = await listQueue();
  for (const event of items) {
    try {
      const result = await api<{ totalXp?: number; level?: number }>(event.path, {
        method: 'POST',
        headers: { 'X-Idempotency-Key': event.id },
        body: JSON.stringify(event.payload),
      });
      if (typeof result.totalXp === 'number' && typeof result.level === 'number') {
        useLearnerStore.getState().applyXp(result.totalXp, result.level);
      }
      await removeFromQueue(event.id);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 409 || error.status === 200 || error.status === 201)) {
        await removeFromQueue(event.id);
        continue;
      }
      throw error;
    }
    await yieldToUi();
  }
}

export async function runCloudSync(): Promise<void> {
  if (flushing) return;
  const platform = usePlatformStore.getState();
  if (platform.deploymentMode === 'offline') {
    await refreshPending();
    useSyncStore.getState().setStatus('idle');
    return;
  }
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    await refreshPending();
    useSyncStore.getState().setStatus('offline');
    return;
  }

  flushing = true;
  useSyncStore.getState().setStatus('syncing');
  try {
    await flushQueue();
    await pullCloudProgress();
    await refreshPending();
    useSyncStore.getState().markSynced();
  } catch (error) {
    await refreshPending();
    useSyncStore.getState().setStatus(
      'error',
      error instanceof Error ? error.message : 'Cloud sync paused'
    );
  } finally {
    flushing = false;
  }
}

export function scheduleCloudSync() {
  if (scheduled || flushing) {
    void refreshPending();
    return;
  }
  scheduled = true;
  const start = () => {
    scheduled = false;
    void runCloudSync();
  };
  globalThis.setTimeout(start, 80);
}

export async function registerBackgroundSync() {
  try {
    if (!('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    const syncManager = (
      registration as ServiceWorkerRegistration & {
        sync?: { register: (tag: string) => Promise<void> };
      }
    ).sync;
    await syncManager?.register('empower-sync');
  } catch {
    /* Background Sync is optional; idle flush still runs. */
  }
}
