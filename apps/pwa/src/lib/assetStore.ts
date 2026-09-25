const DB_NAME = 'empower-assets';
const VERSION = 1;
const FILES = 'files';
const EVIDENCE = 'evidence';

export interface StoredAsset {
  id: string;
  name: string;
  mime: string;
  blob: Blob;
  createdAt: string;
}

export interface EvidenceRecord extends StoredAsset {
  lessonId: string;
  exerciseId: string;
  kind: 'video' | 'audio' | 'photo';
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FILES)) db.createObjectStore(FILES, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(EVIDENCE)) db.createObjectStore(EVIDENCE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function mediaRef(id: string) {
  return `idb:${id}`;
}

export function isIdbRef(url: string) {
  return url.startsWith('idb:');
}

export function idFromRef(url: string) {
  return url.slice(4);
}

export async function saveAsset(file: File | Blob, name?: string): Promise<StoredAsset> {
  const stored: StoredAsset = {
    id: newId('file'),
    name: name ?? (file instanceof File ? file.name : 'workshop-media'),
    mime: file.type || 'application/octet-stream',
    blob: file,
    createdAt: new Date().toISOString(),
  };
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(FILES, 'readwrite');
    tx.objectStore(FILES).put(stored);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return stored;
}

export async function getAsset(id: string): Promise<StoredAsset | undefined> {
  const db = await openDb();
  const item = await new Promise<StoredAsset | undefined>((resolve, reject) => {
    const tx = db.transaction(FILES, 'readonly');
    const request = tx.objectStore(FILES).get(id);
    request.onsuccess = () => resolve(request.result as StoredAsset | undefined);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return item;
}

export async function saveEvidence(input: {
  lessonId: string;
  exerciseId: string;
  kind: EvidenceRecord['kind'];
  blob: Blob;
  name?: string;
}): Promise<EvidenceRecord> {
  const stored: EvidenceRecord = {
    id: newId('evidence'),
    lessonId: input.lessonId,
    exerciseId: input.exerciseId,
    kind: input.kind,
    name: input.name ?? `${input.kind}-evidence`,
    mime: input.blob.type || 'application/octet-stream',
    blob: input.blob,
    createdAt: new Date().toISOString(),
  };
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(EVIDENCE, 'readwrite');
    tx.objectStore(EVIDENCE).put(stored);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return stored;
}

export function pickRecorderMime(kind: 'video' | 'audio'): string {
  const video = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  const audio = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  const list = kind === 'video' ? video : audio;
  if (typeof MediaRecorder === 'undefined') return '';
  return list.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
}
