import { useEffect, useRef, useState } from 'react';
import { listQueue, removeFromQueue } from '@/lib/idbQueue';
import { api, ApiError } from '@/lib/api';
import { isLocalToken } from '@/lib/localApi';
import { useLearnerStore } from '@/store/learnerStore';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const [queueLength, setQueueLength] = useState(0);
  const token = useLearnerStore((s) => s.token);
  const applyXp = useLearnerStore((s) => s.applyXp);
  const isFlushing = useRef(false);

  const refreshCount = async () => {
    try {
      const items = await listQueue();
      setQueueLength(items.length);
    } catch {
      setQueueLength(0);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    void refreshCount();
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline || !token || isLocalToken(token) || isFlushing.current) return;

    const flush = async () => {
      isFlushing.current = true;
      const items = await listQueue();
      for (const event of items) {
        try {
          const result = await api<{ totalXp?: number; level?: number }>(event.path, {
            method: 'POST',
            headers: { 'X-Idempotency-Key': event.id },
            body: JSON.stringify(event.payload),
          });
          if (typeof result.totalXp === 'number' && typeof result.level === 'number') {
            applyXp(result.totalXp, result.level);
          }
          await removeFromQueue(event.id);
        } catch (error) {
          if (error instanceof ApiError && (error.status === 409 || error.status === 201 || error.status === 200)) {
            await removeFromQueue(event.id);
            continue;
          }
          break;
        }
      }
      await refreshCount();
      isFlushing.current = false;
    };

    void flush();
  }, [isOnline, token, applyXp, queueLength]);

  return {
    isOnline,
    queueLength,
    hasPendingSync: queueLength > 0,
    refreshCount,
  };
}
