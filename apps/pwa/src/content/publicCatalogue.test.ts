import { beforeEach, describe, expect, it } from 'vitest';
import { hydratePublicCatalogue, getLesson, lessonsById } from '@/content';

describe('public catalogue', () => {
  beforeEach(async () => {
    await hydratePublicCatalogue();
  });

  it('strips plaintext correctAnswer from learner-facing lessons', async () => {
    const sampleId = Object.keys(lessonsById)[0];
    expect(sampleId).toBeTruthy();
    const raw = lessonsById[sampleId!];
    expect(raw.exercises.some((item) => item.correctAnswer !== undefined)).toBe(true);

    const publicLesson = getLesson(sampleId!);
    expect(publicLesson).toBeTruthy();
    expect(publicLesson!.exercises.every((item) => item.correctAnswer === undefined)).toBe(true);
    expect(publicLesson!.exercises.some((item) => (item.answerHashes?.length ?? 0) > 0)).toBe(true);
  });
});
