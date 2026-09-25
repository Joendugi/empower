import type { Exercise } from '@cyberlearn/types';

export interface GradeResult {
  isCorrect: boolean;
  xpAwarded: number;
  explanation?: string | null;
}

export interface ExerciseProps {
  exercise: Exercise;
  onAnswer: (answer: string | string[]) => Promise<GradeResult>;
}
