import type { Lesson, SkillPath } from '@cyberlearn/types';
import { useCurriculumStore } from '@/store/curriculumStore';
import { applyLessonOverlay, applyPathOverlay } from '@/store/campusCatalogue';
import { toPublicLesson } from '@/lib/publicLesson';
import generatedCatalogue from './generated/catalogue.json';
import { loadCoursePack, packedLesson, prefetchCoursePacks } from './packs';

const yamlSkillPaths = (generatedCatalogue.paths ?? []) as SkillPath[];
/** Stubs: titles and outline only. Full lessons arrive in course packs (./packs). */
const yamlLessons = (generatedCatalogue.lessons ?? []) as Lesson[];

export function isLessonStub(lesson: Lesson | undefined): boolean {
  return Boolean(lesson?.stub);
}

/**
 * Every built-in lesson, from content/ YAML (scripts/generate_catalogue.py). These are stubs;
 * getLesson / getLessonAsync return the full lesson once its course pack is loaded.
 */
export const allLessons: Lesson[] = yamlLessons;

export const lessonsById: Record<string, Lesson> = Object.fromEntries(
  allLessons.map((lesson) => [lesson.id, lesson])
);

let publicLessonsById: Record<string, Lesson> | null = null;
let publicHydrate: Promise<void> | null = null;

/** Strip plaintext answer keys after hashing — call once at app start. */
export async function hydratePublicCatalogue(): Promise<void> {
  if (publicLessonsById) return;
  if (!publicHydrate) {
    publicHydrate = Promise.all(Object.values(lessonsById).map((lesson) => toPublicLesson(lesson))).then((lessons) => {
      publicLessonsById = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]));
    });
  }
  await publicHydrate;
}

function withoutPlaintextAnswers(lesson: Lesson): Lesson {
  return {
    ...lesson,
    exercises: lesson.exercises.map(({ correctAnswer: _omit, ...exercise }) => exercise),
  };
}

function lessonCount(path: SkillPath) {
  return path.nodes.reduce((sum, node) => sum + node.lessonIds.length, 0);
}

function versionWins(incoming: SkillPath, existing: SkillPath) {
  if (incoming.contentVersion && existing.contentVersion) {
    if (incoming.contentVersion > existing.contentVersion) return true;
    if (incoming.contentVersion < existing.contentVersion) return false;
    return lessonCount(incoming) >= lessonCount(existing);
  }
  if (incoming.contentVersion && !existing.contentVersion) return true;
  return lessonCount(incoming) >= lessonCount(existing);
}

export function getSkillPaths(): SkillPath[] {
  const store = useCurriculumStore.getState();
  const cloud = store.cloudPaths ?? [];
  const custom = store.paths ?? [];
  const byId = new Map<string, SkillPath>();
  for (const path of builtInSkillPaths) byId.set(path.id, path);
  for (const path of cloud) {
    const existing = byId.get(path.id);
    if (existing && !versionWins(path, existing)) continue;
    byId.set(path.id, path);
  }
  for (const path of custom) {
    if (!path.id.startsWith('custom-')) continue;
    byId.set(path.id, path);
  }
  return [...byId.values()].map(applyPathOverlay);
}

export function getLesson(id: string): Lesson | undefined {
  const custom = useCurriculumStore.getState().lessons[id];
  if (custom) {
    const lesson = custom.exercises?.some((item) => item.correctAnswer !== undefined)
      ? withoutPlaintextAnswers(custom)
      : custom;
    return applyLessonOverlay(lesson);
  }
  const packed = packedLesson(id);
  if (packed) return applyLessonOverlay(packed);
  if (publicLessonsById?.[id]) return applyLessonOverlay(publicLessonsById[id]);
  const raw = lessonsById[id];
  return raw ? applyLessonOverlay(withoutPlaintextAnswers(raw)) : undefined;
}

/**
 * The full lesson, never a stub: loads the lesson's course pack if needed, then falls back to
 * a copy saved for offline use, then to the API. Undefined when none of those can be reached.
 */
export async function getLessonAsync(id: string): Promise<Lesson | undefined> {
  const local = getLesson(id);
  if (local && !isLessonStub(local)) return local;
  if (local && (await loadCoursePack(local.courseId))) {
    const full = getLesson(id);
    if (full && !isLessonStub(full)) return full;
  }
  const { readCachedLesson } = await import('@/lib/programmePack');
  const saved = await readCachedLesson(id).catch(() => undefined);
  if (saved && !isLessonStub(saved)) return applyLessonOverlay(saved);
  const fetched = await useCurriculumStore.getState().fetchLesson(id);
  return fetched ?? undefined;
}

/** Warm the packs for these skill paths (the learner's chosen courses) in the background. */
export function prefetchPathPacks(pathIds: string[]): Promise<void> {
  const wanted = new Set(pathIds);
  const courseIds = new Set<string>();
  for (const path of getSkillPaths()) {
    if (!wanted.has(path.id)) continue;
    for (const lessonId of path.nodes.flatMap((node) => node.lessonIds)) {
      const lesson = lessonsById[lessonId];
      if (lesson && isLessonStub(lesson)) courseIds.add(lesson.courseId);
    }
  }
  return prefetchCoursePacks(courseIds);
}

/** The official programmes, from content/skill-paths YAML. */
export const builtInSkillPaths: SkillPath[] = yamlSkillPaths;


export function getNextLessonId(lessonId: string): string | undefined {
  for (const path of getSkillPaths()) {
    const ids = path.nodes.flatMap((node) => node.lessonIds);
    const index = ids.indexOf(lessonId);
    if (index >= 0) return ids[index + 1];
  }
  return undefined;
}

export function catalogueStats() {
  const paths = getSkillPaths();
  const lessonCount = new Set([
    ...Object.keys(lessonsById),
    ...Object.keys(useCurriculumStore.getState().lessons),
  ]).size;
  return {
    programmes: paths.length,
    modules: paths.reduce((sum, path) => sum + path.nodes.length, 0),
    lessons: lessonCount,
  };
}
