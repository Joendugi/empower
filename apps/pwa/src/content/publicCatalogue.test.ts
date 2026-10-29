import { beforeEach, describe, expect, it } from 'vitest';
import { hydratePublicCatalogue, getLesson, lessonsById } from '@/content';
import generatedCatalogue from '@/content/generated/catalogue.json';

describe('public catalogue', () => {
  beforeEach(async () => {
    await hydratePublicCatalogue();
  });

  it('ships YAML lessons with answer hashes only, never plaintext keys', () => {
    const exercises = (generatedCatalogue.lessons as Array<{ exercises: Array<Record<string, unknown>> }>).flatMap(
      (lesson) => lesson.exercises
    );
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises.some((item) => 'correctAnswer' in item)).toBe(false);
    expect(exercises.filter((item) => Array.isArray(item.answerHashes)).length).toBeGreaterThan(1000);
  });

  it('strips plaintext correctAnswer from bundled TypeScript lessons', () => {
    const sampleId = Object.keys(lessonsById).find((id) =>
      lessonsById[id].exercises.some((item) => item.correctAnswer !== undefined)
    );
    expect(sampleId).toBeTruthy();

    const publicLesson = getLesson(sampleId!);
    expect(publicLesson).toBeTruthy();
    expect(publicLesson!.exercises.every((item) => item.correctAnswer === undefined)).toBe(true);
    expect(publicLesson!.exercises.some((item) => (item.answerHashes?.length ?? 0) > 0)).toBe(true);
  });
});
