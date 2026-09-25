import type { Exercise, Lesson, ProgrammeTrack, SkillPath } from '@cyberlearn/types';

export type QuizKind = 'MULTIPLE_CHOICE' | 'FILL_BLANK';

export interface QuizDraft {
  id: string;
  type: QuizKind;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: 'a' | 'b' | 'c' | 'd';
  blankAnswer: string;
  explanation: string;
}

export interface WeekDraft {
  id: string;
  weekNumber: number;
  title: string;
  outline: string;
  content: string;
  videoUrl: string;
  videoCaption: string;
  questions: QuizDraft[];
}

export interface CourseDraft {
  id: string;
  title: string;
  titleSw: string;
  description: string;
  track: ProgrammeTrack;
  certificationTarget: string;
  weeks: WeekDraft[];
  status: 'draft' | 'published';
  ownerId?: string;
  ownerEmail?: string;
  updatedAt: string;
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function slug(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || `programme-${Date.now()}`
  );
}

export function blankQuiz(type: QuizKind = 'MULTIPLE_CHOICE'): QuizDraft {
  return {
    id: newId('q'),
    type,
    prompt: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correct: 'a',
    blankAnswer: '',
    explanation: '',
  };
}

export function blankWeek(weekNumber: number): WeekDraft {
  return {
    id: newId('week'),
    weekNumber,
    title: '',
    outline: '',
    content: '',
    videoUrl: '',
    videoCaption: '',
    questions: [blankQuiz()],
  };
}

export function blankCourse(owner?: { ownerId?: string; ownerEmail?: string }): CourseDraft {
  return {
    id: `custom-${slug('course')}-${Date.now()}`,
    title: '',
    titleSw: '',
    description: '',
    track: 'trades',
    certificationTarget: '',
    weeks: [blankWeek(1)],
    status: 'draft',
    ownerId: owner?.ownerId,
    ownerEmail: owner?.ownerEmail,
    updatedAt: new Date().toISOString(),
  };
}

export function outlineItems(text: string) {
  return text
    .split('\n')
    .map((item) => item.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
}

export function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function quizIsReady(quiz: QuizDraft) {
  if (!quiz.prompt.trim()) return false;
  if (quiz.type === 'FILL_BLANK') return Boolean(quiz.blankAnswer.trim());
  return [quiz.optionA, quiz.optionB, quiz.optionC, quiz.optionD].every((item) => item.trim());
}

export function draftChecks(draft: CourseDraft) {
  const weekIssues = draft.weeks.map((week) => {
    const readyQuizzes = week.questions.filter(quizIsReady);
    return {
      weekNumber: week.weekNumber,
      title: Boolean(week.title.trim()),
      outline: outlineItems(week.outline).length >= 2,
      content: wordCount(week.content) >= 40,
      quiz: readyQuizzes.length >= 1,
    };
  });
  const httpsVideos = draft.weeks
    .map((week) => week.videoUrl.trim())
    .filter(Boolean)
    .every((url) => url.startsWith('https://') || url.startsWith('/') || url.startsWith('idb:'));
  return {
    title: Boolean(draft.title.trim()),
    description: Boolean(draft.description.trim()),
    weeks: draft.weeks.length >= 1,
    httpsVideos,
    weekIssues,
    valid:
      Boolean(draft.title.trim()) &&
      Boolean(draft.description.trim()) &&
      draft.weeks.length >= 1 &&
      httpsVideos &&
      weekIssues.every((item) => item.title && item.outline && item.content && item.quiz),
  };
}

function quizToExercise(weekId: string, quiz: QuizDraft, index: number): Exercise | null {
  if (!quizIsReady(quiz)) return null;
  if (quiz.type === 'FILL_BLANK') {
    return {
      id: `${weekId}-fb${index + 1}`,
      type: 'FILL_BLANK',
      prompt: quiz.prompt.trim(),
      correctAnswer: quiz.blankAnswer.trim(),
      hint: 'Use the week notes and outline.',
      explanation: quiz.explanation.trim() || 'Marked from the trainer answer key.',
      xpReward: 40,
    };
  }
  return {
    id: `${weekId}-q${index + 1}`,
    type: 'MULTIPLE_CHOICE',
    prompt: quiz.prompt.trim(),
    options: [
      { id: 'a', text: quiz.optionA.trim() },
      { id: 'b', text: quiz.optionB.trim() },
      { id: 'c', text: quiz.optionC.trim() },
      { id: 'd', text: quiz.optionD.trim() },
    ],
    correctAnswer: quiz.correct,
    hint: 'Review this week’s outline and notes.',
    explanation: quiz.explanation.trim() || 'Marked from the trainer answer key.',
    xpReward: 50,
  };
}

export function buildCourseFromDraft(draft: CourseDraft): { path: SkillPath; lessons: Lesson[] } {
  const lessons: Lesson[] = [];
  const nodes = draft.weeks.map((week, index) => {
    const lessonId = `${draft.id}-week-${week.weekNumber}`;
    const media = week.videoUrl.trim()
      ? [
          {
            kind: 'video' as const,
            url: week.videoUrl.trim(),
            caption: week.videoCaption.trim() || `Week ${week.weekNumber} demonstration`,
          },
        ]
      : [];
    const exercises = week.questions
      .map((quiz, quizIndex) => quizToExercise(lessonId, quiz, quizIndex))
      .filter((item): item is Exercise => Boolean(item));
    const lesson: Lesson = {
      id: lessonId,
      courseId: draft.id,
      title: week.title.trim() || `Week ${week.weekNumber}`,
      weekNumber: week.weekNumber,
      outline: outlineItems(week.outline).join('\n'),
      briefing: week.content.trim(),
      estimatedMinutes: Math.max(20, 12 + exercises.length * 6 + (media.length ? 8 : 0)),
      license: 'CC-BY-SA-4.0',
      examDomain: `Week ${week.weekNumber}`,
      media,
      exercises,
      xpTotal: exercises.reduce((sum, item) => sum + item.xpReward, 0),
      contentVersion: draft.updatedAt,
    };
    lessons.push(lesson);
    const previous = index > 0 ? draft.weeks[index - 1] : undefined;
    return {
      id: `${draft.id}-node-${week.weekNumber}`,
      title: `Week ${week.weekNumber} — ${week.title.trim() || 'Untitled'}`,
      description: outlineItems(week.outline).slice(0, 2).join(' · ') || draft.description.trim(),
      outline: outlineItems(week.outline).join('\n'),
      weekNumber: week.weekNumber,
      prerequisites: previous ? [`${draft.id}-node-${previous.weekNumber}`] : [],
      lessonIds: [lessonId],
      badgeIds: [],
      icon: week.weekNumber === 1 ? '📘' : '📗',
      lessonCount: 1,
      xpTotal: lesson.xpTotal,
      examDomain: `Week ${week.weekNumber}`,
    };
  });
  const path: SkillPath = {
    id: draft.id,
    track: draft.track,
    title: draft.title.trim(),
    titleSw: draft.titleSw.trim() || undefined,
    description: draft.description.trim(),
    certificationTarget: draft.certificationTarget.trim() || 'Campus programme',
    nodes,
  };
  return { path, lessons };
}

export function draftFromPublished(path: SkillPath, lessonsById: Record<string, Lesson>): CourseDraft {
  return {
    id: path.id,
    title: path.title,
    titleSw: path.titleSw ?? '',
    description: path.description,
    track: path.track ?? 'trades',
    certificationTarget: path.certificationTarget ?? '',
    status: 'published',
    updatedAt: new Date().toISOString(),
    weeks: path.nodes.map((node, index) => {
      const lesson = lessonsById[node.lessonIds[0] ?? ''];
      const video = lesson?.media?.find((asset) => asset.kind === 'video');
      const questions: QuizDraft[] = (lesson?.exercises ?? [])
        .filter((exercise) => exercise.type === 'MULTIPLE_CHOICE' || exercise.type === 'FILL_BLANK')
        .map((exercise) => ({
          id: exercise.id,
          type: exercise.type as QuizKind,
          prompt: exercise.prompt,
          optionA: exercise.options?.[0]?.text ?? '',
          optionB: exercise.options?.[1]?.text ?? '',
          optionC: exercise.options?.[2]?.text ?? '',
          optionD: exercise.options?.[3]?.text ?? '',
          correct: (['a', 'b', 'c', 'd'].includes(String(exercise.correctAnswer))
            ? exercise.correctAnswer
            : 'a') as QuizDraft['correct'],
          blankAnswer: typeof exercise.correctAnswer === 'string' ? exercise.correctAnswer : '',
          explanation: exercise.explanation ?? '',
        }));
      return {
        id: node.id,
        weekNumber: node.weekNumber ?? index + 1,
        title: lesson?.title ?? node.title.replace(/^Week \d+\s+[—-]\s+/, ''),
        outline: node.outline ?? lesson?.outline ?? '',
        content: lesson?.briefing ?? node.description ?? '',
        videoUrl: video?.url ?? '',
        videoCaption: video?.caption ?? '',
        questions: questions.length ? questions : [blankQuiz()],
      };
    }),
  };
}
