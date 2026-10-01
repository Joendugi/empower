import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lesson, SkillPath } from '@cyberlearn/types';
import { hashPassword } from '@/lib/localAccounts';

export interface CoursePdf {
  id: string;
  title: string;
  assetId?: string;
  url?: string;
  scannable: boolean;
  createdAt: string;
}

export interface CourseReview {
  id: string;
  pathId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  comment: string;
  learnerName: string;
  learnerEmail: string;
  createdAt: string;
}

export interface PathOverlay {
  pathId: string;
  title?: string;
  description?: string;
  educatorName?: string;
  school?: string;
  relatedIds: string[];
  pdfs: CoursePdf[];
  lockHash?: string | null;
  lessonBriefings: Record<string, string>;
  lessonTitles: Record<string, string>;
  updatedAt: string;
  updatedBy: string;
}

interface CampusState {
  overlays: Record<string, PathOverlay>;
  reviews: CourseReview[];
  upsertOverlay: (pathId: string, patch: Partial<PathOverlay>, updatedBy: string) => void;
  addPdf: (pathId: string, pdf: Omit<CoursePdf, 'id' | 'createdAt'>, updatedBy: string) => void;
  setLock: (pathId: string, password: string | null, updatedBy: string) => Promise<void>;
  addReview: (review: Omit<CourseReview, 'id' | 'createdAt'>) => void;
  exportOverlays: () => string;
}

const UNLOCKS = 'empower-material-unlocks';

function nid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function emptyOverlay(pathId: string): PathOverlay {
  return {
    pathId,
    relatedIds: [],
    pdfs: [],
    lessonBriefings: {},
    lessonTitles: {},
    updatedAt: new Date().toISOString(),
    updatedBy: '',
  };
}

const samplePlumbing: PathOverlay = {
  pathId: 'plumbing',
  educatorName: 'Sample trainer',
  school: 'Nairobi Technical Training Institute',
  relatedIds: ['electrical-installation', 'solar-energy', 'water-sanitation-hygiene'],
  pdfs: [],
  lessonBriefings: {},
  lessonTitles: {},
  updatedAt: '2026-01-15T08:00:00.000Z',
  updatedBy: 'sample.trainer@empower.ke',
};

export const useCampusCatalogue = create<CampusState>()(
  persist(
    (set, get) => ({
      overlays: { plumbing: samplePlumbing },
      reviews: [],
      upsertOverlay: (pathId, patch, updatedBy) => {
        const current = get().overlays[pathId] ?? emptyOverlay(pathId);
        set({
          overlays: {
            ...get().overlays,
            [pathId]: {
              ...current,
              ...patch,
              pathId,
              relatedIds: patch.relatedIds ?? current.relatedIds,
              pdfs: patch.pdfs ?? current.pdfs,
              lessonBriefings: { ...current.lessonBriefings, ...(patch.lessonBriefings ?? {}) },
              lessonTitles: { ...current.lessonTitles, ...(patch.lessonTitles ?? {}) },
              updatedAt: new Date().toISOString(),
              updatedBy,
            },
          },
        });
      },
      addPdf: (pathId, pdf, updatedBy) => {
        const current = get().overlays[pathId] ?? emptyOverlay(pathId);
        get().upsertOverlay(
          pathId,
          {
            pdfs: [
              { ...pdf, id: nid('pdf'), createdAt: new Date().toISOString() },
              ...current.pdfs,
            ],
          },
          updatedBy
        );
      },
      setLock: async (pathId, password, updatedBy) => {
        const lockHash = password ? await hashPassword(`material:${pathId}`, password) : null;
        get().upsertOverlay(pathId, { lockHash }, updatedBy);
        if (!password) forgetUnlock(pathId);
      },
      addReview: (review) => {
        set((state) => ({
          reviews: [
            {
              ...review,
              id: nid('rev'),
              createdAt: new Date().toISOString(),
              comment: review.comment.trim(),
            },
            ...state.reviews.filter(
              (item) =>
                !(item.pathId === review.pathId && item.learnerEmail.toLowerCase() === review.learnerEmail.toLowerCase())
            ),
          ],
        }));
      },
      exportOverlays: () => JSON.stringify({ overlays: get().overlays }, null, 2),
    }),
    { name: 'empower-campus-catalogue' }
  )
);

export function overlayFor(pathId: string) {
  return useCampusCatalogue.getState().overlays[pathId];
}

export function applyPathOverlay(path: SkillPath): SkillPath {
  const overlay = overlayFor(path.id);
  if (!overlay) return path;
  return {
    ...path,
    title: overlay.title?.trim() || path.title,
    description: overlay.description?.trim() || path.description,
  };
}

export function applyLessonOverlay(lesson: Lesson): Lesson {
  const overlay = overlayFor(lesson.courseId);
  if (!overlay) return lesson;
  return {
    ...lesson,
    title: overlay.lessonTitles[lesson.id]?.trim() || lesson.title,
    briefing: overlay.lessonBriefings[lesson.id]?.trim() || lesson.briefing,
  };
}

export function relatedProgrammeIds(path: SkillPath, catalogue: SkillPath[]) {
  const explicit = overlayFor(path.id)?.relatedIds ?? [];
  const auto = catalogue
    .filter((item) => item.id !== path.id && item.track === path.track)
    .map((item) => item.id);
  return [...new Set([...explicit, ...auto])].slice(0, 6);
}

export function ratingSummary(pathId: string) {
  const reviews = useCampusCatalogue.getState().reviews.filter((item) => item.pathId === pathId);
  const average = reviews.length ? reviews.reduce((sum, item) => sum + item.stars, 0) / reviews.length : 0;
  return { average, count: reviews.length, reviews };
}

export function isMaterialLocked(pathId: string) {
  return Boolean(overlayFor(pathId)?.lockHash);
}

function readUnlocks(): string[] {
  try {
    const raw = sessionStorage.getItem(UNLOCKS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isMaterialUnlocked(pathId: string) {
  if (!isMaterialLocked(pathId)) return true;
  return readUnlocks().includes(pathId);
}

export function rememberUnlock(pathId: string) {
  const next = [...new Set([...readUnlocks(), pathId])];
  sessionStorage.setItem(UNLOCKS, JSON.stringify(next));
}

export function forgetUnlock(pathId: string) {
  sessionStorage.setItem(UNLOCKS, JSON.stringify(readUnlocks().filter((item) => item !== pathId)));
}

export async function unlockMaterial(pathId: string, password: string) {
  const hash = overlayFor(pathId)?.lockHash;
  if (!hash) return true;
  const { findLocalAccount } = await import('@/lib/localAccounts');
  void findLocalAccount;
  const computed = await hashPassword(`material:${pathId}`, password, hash.split(':')[4]);
  if (computed !== hash) return false;
  rememberUnlock(pathId);
  return true;
}
