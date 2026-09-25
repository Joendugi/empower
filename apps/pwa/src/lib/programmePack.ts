import type { Lesson, MediaAsset, SkillPath } from '@cyberlearn/types';
import { getLesson, getSkillPaths } from '@/content';
import { api } from '@/lib/api';
import { collectMedia, isMediaAllowed, resolveMediaUrl } from '@/lib/media';
import { yieldToUi } from '@/lib/sessionSecurity';

export const LIBRARY_DB = 'empower-library';
export const MEDIA_CACHE = 'empower-programme-media';
const PACKS = 'packs';
const LESSONS = 'lessons';
const VERSION = 1;

export type PackStatus = 'idle' | 'queued' | 'downloading' | 'ready' | 'error';

export interface ProgrammePack {
  id: string;
  path: SkillPath;
  lessonIds: string[];
  status: PackStatus;
  lessonsReady: number;
  mediaReady: number;
  mediaTotal: number;
  cachedAt: string;
  error?: string;
}

export function isCacheableMediaUrl(url: string): boolean {
  if (url.startsWith('idb:') || url.startsWith('blob:')) return false;
  try {
    const parsed = new URL(url, typeof window === 'undefined' ? 'https://local.empower' : window.location.origin);
    if (/(youtube\.com|youtu\.be|vimeo\.com)$/i.test(parsed.hostname)) return false;
    return /\.(mp4|webm|mp3|ogg|wav|m4a|png|jpe?g|webp|gif|svg)(\?|$)/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

export function collectCacheableUrls(lesson: Lesson): string[] {
  const assets: MediaAsset[] = [
    ...collectMedia(lesson.media),
    ...lesson.exercises.flatMap((exercise) => collectMedia(exercise.media)),
  ];
  const urls = new Set<string>();
  for (const asset of assets) {
    const url = resolveMediaUrl(asset);
    if (!url || !isCacheableMediaUrl(url)) continue;
    if (!isMediaAllowed(url).ok) continue;
    urls.add(url);
  }
  return [...urls];
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LIBRARY_DB, VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PACKS)) db.createObjectStore(PACKS, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(LESSONS)) db.createObjectStore(LESSONS, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbPut(store: string, value: object) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(value);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function idbGet<T>(store: string, id: string): Promise<T | undefined> {
  const db = await openDb();
  const value = await new Promise<T | undefined>((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const request = tx.objectStore(store).get(id);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return value;
}

async function idbGetAll<T>(store: string): Promise<T[]> {
  const db = await openDb();
  const value = await new Promise<T[]>((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const request = tx.objectStore(store).getAll();
    request.onsuccess = () => resolve((request.result as T[]) ?? []);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return value;
}

export async function listSavedPacks(): Promise<ProgrammePack[]> {
  return idbGetAll<ProgrammePack>(PACKS);
}

export async function readCachedLesson(id: string): Promise<Lesson | undefined> {
  return idbGet<Lesson>(LESSONS, id);
}

export async function writeCachedLesson(lesson: Lesson) {
  await idbPut(LESSONS, lesson);
}

export function findPathForLesson(lessonId: string, paths = getSkillPaths()): SkillPath | undefined {
  return paths.find((path) => path.nodes.some((node) => node.lessonIds.includes(lessonId)));
}

export async function loadLessonForPack(lessonId: string): Promise<Lesson | undefined> {
  const local = getLesson(lessonId) ?? (await readCachedLesson(lessonId));
  if (local) return local;
  try {
    return await api<Lesson>(`/lessons/${lessonId}`);
  } catch {
    return undefined;
  }
}

export async function cacheMediaUrl(url: string): Promise<boolean> {
  if (typeof caches === 'undefined') return false;
  try {
    const cache = await caches.open(MEDIA_CACHE);
    if (await cache.match(url)) return true;
    const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!response.ok) return false;
    await cache.put(url, response);
    return true;
  } catch {
    return false;
  }
}

export async function saveProgrammePack(
  path: SkillPath,
  onProgress?: (pack: ProgrammePack) => void
): Promise<ProgrammePack> {
  const lessonIds = path.nodes.flatMap((node) => node.lessonIds);
  const pack: ProgrammePack = {
    id: path.id,
    path,
    lessonIds,
    status: 'downloading',
    lessonsReady: 0,
    mediaReady: 0,
    mediaTotal: 0,
    cachedAt: new Date().toISOString(),
  };
  onProgress?.(pack);
  await idbPut(PACKS, pack);

  const mediaUrls = new Set<string>();
  for (const [index, lessonId] of lessonIds.entries()) {
    const lesson = await loadLessonForPack(lessonId);
    if (lesson) {
      await writeCachedLesson(lesson);
      pack.lessonsReady += 1;
      for (const url of collectCacheableUrls(lesson)) mediaUrls.add(url);
    }
    if (index % 2 === 1) await yieldToUi();
    onProgress?.({ ...pack });
  }

  pack.mediaTotal = mediaUrls.size;
  onProgress?.({ ...pack });

  let mediaIndex = 0;
  for (const url of mediaUrls) {
    if (await cacheMediaUrl(url)) pack.mediaReady += 1;
    mediaIndex += 1;
    if (mediaIndex % 2 === 0) await yieldToUi();
    onProgress?.({ ...pack });
  }

  pack.status = pack.lessonsReady === lessonIds.length ? 'ready' : pack.lessonsReady > 0 ? 'ready' : 'error';
  if (pack.status === 'error') pack.error = 'No lessons could be saved on this device';
  pack.cachedAt = new Date().toISOString();
  await idbPut(PACKS, pack);
  onProgress?.(pack);
  return pack;
}

export async function prefetchLessonPack(lessonId: string) {
  const lesson = await loadLessonForPack(lessonId);
  if (!lesson) return;
  await writeCachedLesson(lesson);
  for (const url of collectCacheableUrls(lesson)) {
    await cacheMediaUrl(url);
  }
}
