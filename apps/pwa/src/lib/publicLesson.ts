import type { Exercise, Lesson } from '@cyberlearn/types';
import { hashAnswer } from '@/lib/hash';

export async function hashesForAnswer(correct: unknown): Promise<string[]> {
  if (correct === undefined) return [];
  const hashes = [await hashAnswer(correct)];
  if (Array.isArray(correct)) {
    hashes.push(await hashAnswer([...correct].map(String).sort()));
  }
  return hashes;
}

export async function toPublicExercise(exercise: Exercise): Promise<Exercise> {
  const hashes = exercise.answerHashes?.length
    ? exercise.answerHashes
    : await hashesForAnswer(exercise.correctAnswer);
  const { correctAnswer: _omit, ...rest } = exercise;
  return { ...rest, answerHashes: hashes };
}

export async function toPublicLesson(lesson: Lesson): Promise<Lesson> {
  return {
    ...lesson,
    exercises: await Promise.all(lesson.exercises.map(toPublicExercise)),
  };
}
