import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Lesson } from '@cyberlearn/types';
import { getLesson, getLessonAsync, hydratePublicCatalogue, isLessonStub } from '@/content';
import { useCurriculumStore } from '@/store/curriculumStore';
import { resetCoursePacks } from '@/content/packs';
import generatedCatalogue from '@/content/generated/catalogue.json';
import manifest from '../../public/packs/manifest.json';

const packFiles = import.meta.glob<{ courseId: string; lessons: Lesson[] }>('../../public/packs/*.*.json', {
  eager: true,
  import: 'default',
});
const packsByFile = Object.fromEntries(
  Object.entries(packFiles).map(([path, pack]) => [path.split('/').pop() as string, pack])
);
const packLessons = Object.values(packFiles).flatMap((pack) => pack.lessons);

describe('public catalogue', () => {
  beforeEach(async () => {
    await hydratePublicCatalogue();
  });

  it('bundles only lesson stubs; exercises and notes live in course packs', () => {
    const stubs = generatedCatalogue.lessons as Array<Record<string, unknown>>;
    expect(stubs.length).toBeGreaterThan(200);
    expect(stubs.every((lesson) => lesson.stub === true && (lesson.exercises as unknown[]).length === 0)).toBe(true);
    expect(stubs.some((lesson) => 'contentMd' in lesson || 'briefing' in lesson)).toBe(false);
    // Every stub has its full lesson in exactly the pack the manifest names for its course.
    for (const stub of stubs) {
      const entry = (manifest.packs as Record<string, { file: string; lessonIds: string[] }>)[stub.courseId as string];
      expect(entry?.lessonIds).toContain(stub.id);
      expect(packsByFile[entry.file]?.lessons.some((lesson) => lesson.id === stub.id)).toBe(true);
    }
  });

  it('ships pack exercises with answer hashes only, never plaintext keys', () => {
    const exercises = packLessons.flatMap((lesson) => lesson.exercises);
    expect(exercises.some((item) => 'correctAnswer' in item)).toBe(false);
    expect(exercises.filter((item) => Array.isArray(item.answerHashes)).length).toBeGreaterThan(1000);
  });

  it('strips plaintext correctAnswer from lessons saved on the device', () => {
    const custom: Lesson = {
      id: 'custom-plaintext-check',
      courseId: 'custom-course',
      title: 'Custom',
      estimatedMinutes: 5,
      xpTotal: 10,
      exercises: [{ id: 'q1', type: 'FILL_BLANK', prompt: 'Two plus two is ___.', correctAnswer: '4', xpReward: 10 }],
    };
    const before = useCurriculumStore.getState().lessons;
    useCurriculumStore.setState({ lessons: { ...before, [custom.id]: custom } });
    try {
      expect(getLesson(custom.id)!.exercises.every((item) => item.correctAnswer === undefined)).toBe(true);
    } finally {
      useCurriculumStore.setState({ lessons: before });
    }
  });
});

describe('course packs', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    resetCoursePacks();
  });

  it('loads the full lesson from its pack in place of the stub', async () => {
    const stub = (generatedCatalogue.lessons as Lesson[]).find((lesson) => lesson.courseId === 'automotive')!;
    expect(isLessonStub(getLesson(stub.id))).toBe(true);

    const requested: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        const name = url.split('/').pop() as string;
        requested.push(name);
        const body = name === 'manifest.json' ? manifest : packsByFile[name];
        return new Response(JSON.stringify(body), { status: body ? 200 : 404 });
      })
    );

    const full = await getLessonAsync(stub.id);
    expect(isLessonStub(full)).toBe(false);
    expect(full!.exercises.length).toBeGreaterThan(0);
    expect(isLessonStub(getLesson(stub.id))).toBe(false);
    expect(requested).toEqual(['manifest.json', manifest.packs.automotive.file]);
  });
});
