import type { Lesson } from '@cyberlearn/types';
import { create } from 'zustand';

/**
 * Course packs: the full lessons (exercises, briefings, notes) for one course, published as
 * static JSON next to the app (scripts/generate_catalogue.py writes them to public/packs).
 * The app bundle only carries short lesson stubs; a pack is fetched when one of its lessons
 * opens, or ahead of time for courses the learner chose. The service worker caches packs, so
 * a course stays usable offline once it has been fetched.
 */

interface PackEntry {
  file: string;
  version: string;
  lessonIds: string[];
  bytes: number;
}

interface PackManifest {
  version: string;
  packs: Record<string, PackEntry>;
}

interface PackFile {
  courseId: string;
  lessons: Lesson[];
}

interface PackState {
  /** Full lessons from every pack loaded in this session, by lesson id. */
  lessons: Record<string, Lesson>;
  /** courseId → pack version that is loaded. */
  loaded: Record<string, string>;
}

export const usePackStore = create<PackState>(() => ({ lessons: {}, loaded: {} }));

const PACK_BASE = `${(import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')}packs/`;

let manifestRequest: Promise<PackManifest | null> | null = null;
const packRequests = new Map<string, Promise<boolean>>();

function loadManifest(): Promise<PackManifest | null> {
  if (!manifestRequest) {
    manifestRequest = fetch(`${PACK_BASE}manifest.json`, { credentials: 'omit' })
      .then((res) => (res.ok ? (res.json() as Promise<PackManifest>) : null))
      .catch(() => null)
      .then((manifest) => {
        if (!manifest) manifestRequest = null; // try again next time (offline, or the CDN hiccupped)
        return manifest;
      });
  }
  return manifestRequest;
}

/** Fetch one course's pack and make its lessons available to getLesson. Resolves false when offline. */
export function loadCoursePack(courseId: string): Promise<boolean> {
  if (usePackStore.getState().loaded[courseId]) return Promise.resolve(true);
  const pending = packRequests.get(courseId);
  if (pending) return pending;

  const request = (async () => {
    const manifest = await loadManifest();
    const entry = manifest?.packs[courseId];
    if (!entry) return false;
    try {
      const res = await fetch(`${PACK_BASE}${entry.file}`, { credentials: 'omit' });
      if (!res.ok) return false;
      const pack = (await res.json()) as PackFile;
      usePackStore.setState((state) => ({
        lessons: {
          ...state.lessons,
          ...Object.fromEntries(pack.lessons.map((lesson) => [lesson.id, lesson])),
        },
        loaded: { ...state.loaded, [courseId]: entry.version },
      }));
      return true;
    } catch {
      return false;
    }
  })().finally(() => packRequests.delete(courseId));

  packRequests.set(courseId, request);
  return request;
}

/** Fetch packs in the background, a few at a time, so they're ready (and cached) before they're needed. */
export async function prefetchCoursePacks(courseIds: Iterable<string>, concurrency = 2): Promise<void> {
  const queue = [...new Set(courseIds)].filter((id) => !usePackStore.getState().loaded[id]);
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    for (let id = queue.shift(); id; id = queue.shift()) {
      await loadCoursePack(id);
    }
  });
  await Promise.all(workers);
}

export function packedLesson(id: string): Lesson | undefined {
  return usePackStore.getState().lessons[id];
}

/** For tests. */
export function resetCoursePacks() {
  manifestRequest = null;
  packRequests.clear();
  usePackStore.setState({ lessons: {}, loaded: {} });
}
