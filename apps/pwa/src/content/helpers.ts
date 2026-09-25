import type { Exercise, Lesson, MediaAsset, SkillNode } from '@cyberlearn/types';

export function makeLesson(lesson: Omit<Lesson, 'xpTotal'> & { xpTotal?: number }): Lesson {
  return {
    license: 'CC-BY-SA-4.0',
    ...lesson,
    xpTotal: lesson.xpTotal ?? lesson.exercises.reduce((sum, exercise) => sum + exercise.xpReward, 0),
  };
}

export function nodeFromLessons(
  node: Omit<SkillNode, 'badgeIds' | 'lessonCount' | 'xpTotal' | 'lessonIds'> & {
    badgeIds?: string[];
    lessons: Lesson[];
  }
): SkillNode {
  const { lessons, ...rest } = node;
  return {
    ...rest,
    badgeIds: node.badgeIds ?? [],
    lessonIds: lessons.map((lesson) => lesson.id),
    lessonCount: lessons.length,
    xpTotal: lessons.reduce((sum, lesson) => sum + lesson.xpTotal, 0),
  };
}

export function mcq(
  id: string,
  prompt: string,
  options: [string, string, string, string],
  correct: 'a' | 'b' | 'c' | 'd',
  hint: string,
  explanation: string,
  xpReward = 50
): Exercise {
  const labels = ['a', 'b', 'c', 'd'] as const;
  return {
    id,
    type: 'MULTIPLE_CHOICE',
    prompt,
    options: options.map((text, index) => ({ id: labels[index], text })),
    correctAnswer: correct,
    hint,
    explanation,
    xpReward,
  };
}

export function fillBlank(
  id: string,
  prompt: string,
  correctAnswer: string,
  hint: string,
  explanation: string,
  xpReward = 50
): Exercise {
  return {
    id,
    type: 'FILL_BLANK',
    prompt,
    correctAnswer,
    hint,
    explanation,
    xpReward,
  };
}

export function diagramLabel(
  id: string,
  prompt: string,
  slots: Array<{ id: string; label: string; x: number; y: number }>,
  hint: string,
  explanation: string,
  diagramKind?: string,
  xpReward = 50
): Exercise {
  return {
    id,
    type: 'DIAGRAM_LABEL',
    prompt,
    diagramSlots: slots,
    diagramKind,
    options: slots.map((slot) => ({ id: slot.id, text: slot.label })),
    correctAnswer: slots.map((slot) => `${slot.id}=${slot.id}`),
    hint,
    explanation,
    xpReward,
  };
}

export function mediaWatch(
  id: string,
  prompt: string,
  media: MediaAsset[],
  xpReward = 20
): Exercise {
  return {
    id,
    type: 'MEDIA',
    prompt,
    correctAnswer: 'watched',
    hint: 'Play or watch the demonstration, then confirm.',
    explanation: 'You confirmed that the demonstration was completed.',
    xpReward,
    media,
  };
}

export function scenario(
  id: string,
  prompt: string,
  options: [string, string, string, string],
  correct: 'a' | 'b' | 'c' | 'd',
  hint: string,
  explanation: string,
  xpReward = 60
): Exercise {
  return { ...mcq(id, prompt, options, correct, hint, explanation, xpReward), type: 'SCENARIO' };
}

export function matchPairs(
  id: string,
  prompt: string,
  pairs: Array<{ leftId: string; left: string; rightId: string; right: string }>,
  hint: string,
  explanation: string,
  xpReward = 50
): Exercise {
  return {
    id,
    type: 'MATCH_PAIRS',
    prompt,
    pairs: pairs.map((pair) => ({
      left: { id: pair.leftId, text: pair.left },
      right: { id: pair.rightId, text: pair.right },
    })),
    correctAnswer: pairs.map((pair) => `${pair.leftId}=${pair.rightId}`),
    hint,
    explanation,
    xpReward,
  };
}

export type QuizChoice = 'a' | 'b' | 'c' | 'd';

export interface WeekQuiz {
  prompt: string;
  options: [string, string, string, string];
  correct: QuizChoice;
  hint: string;
  explanation: string;
}

export interface WeekBlank {
  prompt: string;
  answer: string;
  hint: string;
  explanation: string;
}

export interface WeekPair {
  leftId: string;
  left: string;
  rightId: string;
  right: string;
}

/** One assessed week of a CDACC / Security+ semester unit. */
export interface WeekSpec {
  id: string;
  courseId: string;
  title: string;
  titleSw: string;
  briefing: string;
  briefingSw: string;
  minutes?: number;
  cdacc?: string;
  examDomain: string;
  media?: MediaAsset[];
  questions: WeekQuiz[];
  blanks?: WeekBlank[];
  pairs?: WeekPair[];
  pairPrompt?: string;
  pairHint?: string;
  pairExplanation?: string;
  practice: WeekQuiz;
}

export function weekLesson(spec: WeekSpec): Lesson {
  return makeLesson({
    id: spec.id,
    courseId: spec.courseId,
    title: spec.title,
    titleSw: spec.titleSw,
    briefing: spec.briefing,
    briefingSw: spec.briefingSw,
    estimatedMinutes: spec.minutes ?? 28,
    cdaccUnitId: spec.cdacc,
    examDomain: spec.examDomain,
    media: spec.media,
    exercises: [
      ...(spec.pairs?.length
        ? [
            matchPairs(
              `${spec.id}-match`,
              spec.pairPrompt ?? 'Match each term to its meaning.',
              spec.pairs,
              spec.pairHint ?? 'Use the study notes.',
              spec.pairExplanation ?? 'Each pair is a standard exam mapping.'
            ),
          ]
        : []),
      ...spec.questions.map((question, index) =>
        mcq(
          `${spec.id}-q${index + 1}`,
          question.prompt,
          question.options,
          question.correct,
          question.hint,
          question.explanation
        )
      ),
      ...(spec.blanks ?? []).map((blank, index) =>
        fillBlank(`${spec.id}-fb${index + 1}`, blank.prompt, blank.answer, blank.hint, blank.explanation)
      ),
      scenario(
        `${spec.id}-scenario`,
        spec.practice.prompt,
        spec.practice.options,
        spec.practice.correct,
        spec.practice.hint,
        spec.practice.explanation
      ),
    ],
  });
}
