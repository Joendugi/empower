const DB_NAME = 'cyberlearn';
const STORE = 'offlineQueue';

export interface QueuedEvent {
  id: string;
  type: 'submission' | 'lesson_complete' | 'review';
  path: string;
  payload: Record<string, unknown>;
  queuedAt: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function enqueue(event: Omit<QueuedEvent, 'id' | 'queuedAt'>): Promise<QueuedEvent> {
  const queued: QueuedEvent = {
    ...event,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    queuedAt: new Date().toISOString(),
  };
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(queued);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return queued;
}

export async function listQueue(): Promise<QueuedEvent[]> {
  const db = await openDb();
  const items = await new Promise<QueuedEvent[]>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve((request.result as QueuedEvent[]) ?? []);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return items.sort((a, b) => a.queuedAt.localeCompare(b.queuedAt));
}

export async function removeFromQueue(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}
