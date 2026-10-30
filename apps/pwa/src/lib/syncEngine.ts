import { api, ApiError } from '@/lib/api';
import { listQueue, removeFromQueue, type QueuedEvent } from '@/lib/idbQueue';
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

const SYNC_BATCH = 200;

interface SyncResponse {
  results: Array<{ id: string; status: 'applied' | 'duplicate' | 'rejected'; detail?: string | null }>;
  state: {
    totalXp: number;
    level: number;
    completedLessonIds: string[];
    currentStreak: number;
    longestStreak: number;
    freezeTokens: number;
  };
}

/** Older APIs have no /sync: replay one request per event. */
async function flushOneByOne(items: QueuedEvent[]) {
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

function applyServerState(state: SyncResponse['state']) {
  const store = useLearnerStore.getState();
  store.applyXp(state.totalXp, state.level);
  store.setStreak(state.currentStreak, state.longestStreak, state.freezeTokens);
  for (const lessonId of state.completedLessonIds) store.markLessonComplete(lessonId);
}

/** Returns true when the server's progress was applied (so there's no need to pull it separately). */
async function flushQueue(): Promise<boolean> {
  const token = useLearnerStore.getState().token;
  if (!token || isLocalToken(token)) return false;
  const items = await listQueue();
  if (!items.length) return false;
  for (let start = 0; start < items.length; start += SYNC_BATCH) {
    const batch = items.slice(start, start + SYNC_BATCH);
    let response: SyncResponse;
    try {
      response = await api<SyncResponse>('/sync', {
        method: 'POST',
        body: JSON.stringify({
          deviceId: useLearnerStore.getState().deviceId,
          events: batch.map((event) => ({ id: event.id, type: event.type, payload: event.payload })),
        }),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        await flushOneByOne(items.slice(start));
        return false;
      }
      throw error;
    }
    // Rejected events (an exercise that no longer exists, say) are dropped too, so they
    // can't block everything queued after them.
    for (const result of response.results) await removeFromQueue(result.id);
    applyServerState(response.state);
    await yieldToUi();
  }
  return true;
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
    const synced = await flushQueue();
    if (!synced) await pullCloudProgress();
    try {
      const { syncOfficeCloud } = await import('@/lib/officeSync');
      await syncOfficeCloud();
    } catch {
      /* Office/analytics sync is best-effort and must not block progress flush. */
    }
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
