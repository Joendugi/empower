import { describe, expect, it } from 'vitest';
import { isAnswerCorrect } from '@/lib/hash';
import {
  blankCourse,
  blankQuiz,
  buildCourseFromDraft,
  draftChecks,
  type CourseDraft,
} from '@/lib/curriculumDraft';

function sampleDraft(): CourseDraft {
  const draft = blankCourse();
  draft.title = 'Domestic solar basics';
  draft.description = 'Install and isolate a small household solar circuit safely.';
  draft.weeks[0].title = 'Safety and isolation';
  draft.weeks[0].outline = 'PPE and lock-out\nIdentify live parts\nProve isolation';
  draft.weeks[0].content =
    'Week 1 teaches isolation before any solar work. Wear PPE, lock the isolator, prove dead, and keep a witness. Never skip the test lamp after you think the circuit is off. Write the isolation point on the job card so the next person can prove the same state.';
  draft.weeks[0].questions[0] = {
    ...blankQuiz(),
    prompt: 'What must you do before touching a solar string?',
    optionA: 'Prove isolation',
    optionB: 'Tighten the roof bolts',
    optionC: 'Call the customer’s neighbour',
    optionD: 'Paint the frame',
    correct: 'a',
    explanation: 'Prove dead after lock-out.',
  };
  const week2 = {
    ...draft.weeks[0],
    id: 'week-2',
    weekNumber: 2,
    title: 'Array layout',
    outline: 'Roof survey\nString plan\nShade check',
    content:
      'Week 2 covers array layout: measure the roof, keep walkways, avoid shade, and record string voltage. A sketch is the artefact for this week. Mark fixing points, leave service access, and write the expected open-circuit voltage on the drawing before you climb.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    questions: [
      {
        ...blankQuiz('FILL_BLANK'),
        prompt: 'Record string ___ before closing the isolator.',
        blankAnswer: 'voltage',
        explanation: 'Voltage confirms the string is built as drawn.',
      },
    ],
  };
  draft.weeks.push(week2);
  return draft;
}

describe('curriculum drafts', () => {
  it('builds week 1 and week 2 as learners see them', () => {
    const { path, lessons } = buildCourseFromDraft(sampleDraft());
    expect(path.nodes).toHaveLength(2);
    expect(path.nodes[0].weekNumber).toBe(1);
    expect(path.nodes[1].title).toContain('Week 2');
    expect(lessons[0].outline).toContain('Prove isolation');
    expect(lessons[1].media?.[0]?.kind).toBe('video');
    expect(path.nodes[1].prerequisites).toEqual([path.nodes[0].id]);
  });

  it('requires outline, notes, and an autograded question', () => {
    const draft = blankCourse();
    expect(draftChecks(draft).valid).toBe(false);
    const ready = sampleDraft();
    expect(draftChecks(ready).valid).toBe(true);
  });

  it('autogrades authored multiple-choice and fill-in answers', async () => {
    const { lessons } = buildCourseFromDraft(sampleDraft());
    const mcq = lessons[0].exercises[0];
    const blank = lessons[1].exercises[0];
    expect(await isAnswerCorrect('a', mcq.correctAnswer)).toBe(true);
    expect(await isAnswerCorrect('b', mcq.correctAnswer)).toBe(false);
    expect(await isAnswerCorrect('voltage', blank.correctAnswer)).toBe(true);
    expect(await isAnswerCorrect('current', blank.correctAnswer)).toBe(false);
  });
});
