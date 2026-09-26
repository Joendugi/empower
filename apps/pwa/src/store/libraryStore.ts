import type { Lesson, SkillPath } from '@cyberlearn/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSkillPaths } from '@/content';
import { canAddActivePath, trimActivePathIds } from '@/lib/activeCourses';
import {
  findPathForLesson,
  listSavedPacks,
  prefetchLessonPack,
  readCachedLesson,
  saveProgrammePack,
  type PackStatus,
  type ProgrammePack,
} from '@/lib/programmePack';

interface LibraryState {
  selectedIds: string[];
  packs: Record<string, ProgrammePack>;
  lessons: Record<string, Lesson>;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  selectProgramme: (pathId: string) => boolean;
  deselectProgramme: (pathId: string) => void;
  syncActiveProgrammes: (pathIds: string[]) => void;
  pinLesson: (lessonId: string) => void;
  prefetchLesson: (lessonId: string) => void;
}

const inflight = new Set<string>();

async function downloadPath(path: SkillPath) {
  if (inflight.has(path.id)) return;
  inflight.add(path.id);
  useLibraryStore.setState((state) => ({
    packs: {
      ...state.packs,
      [path.id]: {
        id: path.id,
        path,
        lessonIds: path.nodes.flatMap((node) => node.lessonIds),
        status: 'downloading',
        lessonsReady: state.packs[path.id]?.lessonsReady ?? 0,
        mediaReady: state.packs[path.id]?.mediaReady ?? 0,
        mediaTotal: state.packs[path.id]?.mediaTotal ?? 0,
        cachedAt: new Date().toISOString(),
      },
    },
  }));
  try {
    const pack = await saveProgrammePack(path, (next) => {
      useLibraryStore.setState((state) => ({
        packs: { ...state.packs, [next.id]: next },
      }));
    });
    const lessons: Record<string, Lesson> = {};
    for (const lessonId of pack.lessonIds) {
      const lesson = await readCachedLesson(lessonId);
      if (lesson) lessons[lesson.id] = lesson;
    }
    useLibraryStore.setState((state) => ({
      packs: { ...state.packs, [pack.id]: pack },
      lessons: { ...state.lessons, ...lessons },
    }));
  } catch (error) {
    useLibraryStore.setState((state) => ({
      packs: {
        ...state.packs,
        [path.id]: {
          ...(state.packs[path.id] ?? {
            id: path.id,
            path,
            lessonIds: path.nodes.flatMap((node) => node.lessonIds),
            lessonsReady: 0,
            mediaReady: 0,
            mediaTotal: 0,
            cachedAt: new Date().toISOString(),
          }),
          status: 'error' as PackStatus,
          error: error instanceof Error ? error.message : 'Download failed',
        },
      },
    }));
  } finally {
    inflight.delete(path.id);
  }
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      selectedIds: [],
      packs: {},
      lessons: {},
      hydrated: false,

      hydrate: async () => {
        const saved = await listSavedPacks();
        const lessons: Record<string, Lesson> = {};
        const packs: Record<string, ProgrammePack> = {};
        for (const pack of saved) {
          packs[pack.id] = pack;
          for (const lessonId of pack.lessonIds) {
            const lesson = await readCachedLesson(lessonId);
            if (lesson) lessons[lesson.id] = lesson;
          }
        }
        set((state) => ({
          packs: { ...packs, ...state.packs },
          lessons: { ...lessons, ...state.lessons },
          selectedIds: trimActivePathIds(state.selectedIds),
          hydrated: true,
        }));
        for (const pathId of get().selectedIds) {
          const current = get().packs[pathId];
          if (!current || current.status !== 'ready') {
            const path = getSkillPaths().find((item) => item.id === pathId);
            if (path) void downloadPath(path);
          }
        }
      },

      selectProgramme: (pathId) => {
        const path = getSkillPaths().find((item) => item.id === pathId);
        if (!path) return false;
        const state = get();
        if (state.selectedIds.includes(pathId)) {
          void downloadPath(path);
          return true;
        }
        if (!canAddActivePath(state.selectedIds, pathId)) {
          return false;
        }
        set({ selectedIds: [...state.selectedIds, pathId] });
        void downloadPath(path);
        return true;
      },

      deselectProgramme: (pathId) => {
        set((state) => ({
          selectedIds: state.selectedIds.filter((id) => id !== pathId),
        }));
      },

      syncActiveProgrammes: (pathIds) => {
        const active = trimActivePathIds(pathIds);
        set({ selectedIds: active });
        for (const pathId of active) {
          const path = getSkillPaths().find((item) => item.id === pathId);
          if (!path) continue;
          const current = get().packs[pathId];
          if (!current || current.status !== 'ready') {
            void downloadPath(path);
          }
        }
      },

      pinLesson: (lessonId) => {
        const path = findPathForLesson(lessonId);
        if (path) get().selectProgramme(path.id);
        else void prefetchLessonPack(lessonId);
      },

      prefetchLesson: (lessonId) => {
        void prefetchLessonPack(lessonId);
      },
    }),
    {
      name: 'empower-library',
      version: 2,
      partialize: (state) => ({ selectedIds: trimActivePathIds(state.selectedIds) }),
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<LibraryState>;
        return {
          ...state,
          selectedIds: trimActivePathIds(state.selectedIds ?? []),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.selectedIds = trimActivePathIds(state.selectedIds ?? []);
      },
    }
  )
);

export function resolveLesson(lessonId: string): Lesson | undefined {
  return useLibraryStore.getState().lessons[lessonId];
}

export function packStatusFor(pathId: string): ProgrammePack | undefined {
  return useLibraryStore.getState().packs[pathId];
}
