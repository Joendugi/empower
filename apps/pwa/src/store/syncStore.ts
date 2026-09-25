import { create } from 'zustand';

export type CloudSyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

interface SyncState {
  status: CloudSyncStatus;
  pending: number;
  lastSyncedAt: number | null;
  lastError: string | null;
  setStatus: (status: CloudSyncStatus, error?: string | null) => void;
  setPending: (pending: number) => void;
  markSynced: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'idle',
  pending: 0,
  lastSyncedAt: null,
  lastError: null,
  setStatus: (status, error = null) => set({ status, lastError: error }),
  setPending: (pending) => set({ pending }),
  markSynced: () => set({ status: 'synced', lastSyncedAt: Date.now(), lastError: null }),
}));
