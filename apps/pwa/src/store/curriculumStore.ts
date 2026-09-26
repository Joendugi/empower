import type { AnimationPreset, Lesson, MediaAsset, SkillPath } from '@cyberlearn/types';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { buildCourseFromDraft, type CourseDraft } from '@/lib/curriculumDraft';
import { toPublicLesson } from '@/lib/publicLesson';

function packMedia(input: {
  video?: string;
  audio?: string;
  animation?: string;
  mustFinish?: boolean;
}): MediaAsset[] {
  const assets: MediaAsset[] = [];
  const mustFinish = Boolean(input.mustFinish);
  if (input.video?.trim()) {
    assets.push({ kind: 'video', url: input.video.trim(), mustFinish, caption: 'Lesson video' });
  }
  if (input.audio?.trim()) {
    assets.push({ kind: 'audio', url: input.audio.trim(), mustFinish, caption: 'Lesson audio' });
  }
  if (input.animation?.trim()) {
    const value = input.animation.trim();
    const presets: AnimationPreset[] = ['pulse', 'gear', 'wave', 'weld', 'stitch', 'circuit'];
    if (presets.includes(value as AnimationPreset)) {
      assets.push({ kind: 'animation', preset: value as AnimationPreset, mustFinish, caption: 'Workshop animation' });
    } else {
      assets.push({ kind: 'animation', url: value, mustFinish, caption: 'Animation' });
    }
  }
  return assets;
}

interface CurriculumState {
  paths: SkillPath[];
  lessons: Record<string, Lesson>;
  drafts: CourseDraft[];
  addProgramme: (path: SkillPath, lesson: Lesson | Lesson[]) => void;
  removeProgramme: (pathId: string) => void;
  saveLesson: (lesson: Lesson) => void;
  removeLesson: (lessonId: string) => void;
  saveDraft: (draft: CourseDraft) => void;
  removeDraft: (draftId: string) => void;
  publishDraft: (draftId: string) => { path: SkillPath; lessons: Lesson[] } | null;
}

function slug(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || `programme-${Date.now()}`
  );
}

export function buildProgrammeFromForm(input: {
  title: string;
  titleSw: string;
  description: string;
  track: SkillPath['track'];
  certificationTarget: string;
  moduleTitle: string;
  briefing: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: 'a' | 'b' | 'c' | 'd';
  lessonVideoUrl?: string;
  lessonAudioUrl?: string;
  lessonAnimation?: string;
  questionVideoUrl?: string;
  questionAudioUrl?: string;
  questionAnimation?: string;
  mustFinishMedia?: boolean;
  includeWatchItem?: boolean;
  estimatedMinutes?: number;
  learningOutcomes?: string;
  sourceReferences?: string;
  practicalType?: 'none' | 'video' | 'audio' | 'photo';
  practicalPrompt?: string;
  practicalRubric?: string;
}) {
  const pathId = `custom-${slug(input.title)}-${Date.now()}`;
  const lessonId = `${pathId}-lesson-1`;
  const nodeId = `${pathId}-node-1`;
  const lessonMedia = packMedia({
    video: input.lessonVideoUrl,
    audio: input.lessonAudioUrl,
    animation: input.lessonAnimation,
    mustFinish: input.mustFinishMedia,
  });
  const questionMedia = packMedia({
    video: input.questionVideoUrl,
    audio: input.questionAudioUrl,
    animation: input.questionAnimation,
    mustFinish: input.mustFinishMedia,
  });
  const exercises: Lesson['exercises'] = [];
  if (input.includeWatchItem && (questionMedia.length || lessonMedia.length)) {
    exercises.push({
      id: `${lessonId}-media`,
      type: 'MEDIA',
      prompt: 'Watch or listen, then confirm you have completed the demonstration.',
      correctAnswer: 'watched',
      xpReward: 20,
      media: questionMedia.length ? questionMedia : lessonMedia,
    });
  }
  exercises.push({
    id: `${lessonId}-q1`,
    type: 'MULTIPLE_CHOICE',
    prompt: input.question,
    options: [
      { id: 'a', text: input.optionA },
      { id: 'b', text: input.optionB },
      { id: 'c', text: input.optionC },
      { id: 'd', text: input.optionD },
    ],
    correctAnswer: input.correct,
    hint: 'Review the study notes and media.',
    explanation: 'Marked by the trainer’s answer key.',
    xpReward: 50,
    media: questionMedia,
  });
  if (input.practicalType && input.practicalType !== 'none' && input.practicalPrompt?.trim()) {
    const practicalType = {
      video: 'VIDEO_RECORD',
      audio: 'AUDIO_RECORD',
      photo: 'PHOTO_CAPTURE',
    }[input.practicalType] as 'VIDEO_RECORD' | 'AUDIO_RECORD' | 'PHOTO_CAPTURE';
    const correctAnswer = {
      video: 'recorded',
      audio: 'spoken',
      photo: 'captured',
    }[input.practicalType];
    exercises.push({
      id: `${lessonId}-practical`,
      type: practicalType,
      prompt: input.practicalPrompt.trim(),
      correctAnswer,
      hint: 'Show the full process safely. Check each rubric item before submitting.',
      explanation: 'Practical evidence saved for trainer review.',
      rubric: (input.practicalRubric ?? '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      minSeconds: input.practicalType === 'photo' ? undefined : 8,
      xpReward: 80,
    });
  }
  const outcomes = (input.learningOutcomes ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
  const references = (input.sourceReferences ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
  const briefingParts = [
    outcomes.length ? `Learning outcomes\n${outcomes.map((item) => `• ${item}`).join('\n')}` : '',
    input.briefing.trim(),
    references.length ? `Sources and standards\n${references.map((item) => `• ${item}`).join('\n')}` : '',
  ].filter(Boolean);
  const lesson: Lesson = {
    id: lessonId,
    courseId: pathId,
    title: input.moduleTitle || input.title,
    titleSw: input.titleSw || undefined,
    briefing: briefingParts.join('\n\n'),
    estimatedMinutes: Math.max(10, input.estimatedMinutes ?? 30),
    license: 'CC-BY-SA-4.0',
    examDomain: 'Trainer-authored',
    media: lessonMedia,
    exercises,
    xpTotal: exercises.reduce((sum, item) => sum + item.xpReward, 0),
  };
  const path: SkillPath = {
    id: pathId,
    track: input.track,
    title: input.title.trim(),
    titleSw: input.titleSw.trim() || undefined,
    description: input.description.trim(),
    certificationTarget: input.certificationTarget.trim() || 'Campus programme',
    nodes: [
      {
        id: nodeId,
        title: input.moduleTitle.trim() || input.title.trim(),
        description: input.description.trim(),
        prerequisites: [],
        lessonIds: [lessonId],
        badgeIds: [],
        icon: '📘',
        lessonCount: 1,
        xpTotal: lesson.xpTotal,
      },
    ],
  };
  return { path, lesson };
}

function asLessonList(lesson: Lesson | Lesson[]) {
  return Array.isArray(lesson) ? lesson : [lesson];
}

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set, get) => ({
      paths: [],
      lessons: {},
      drafts: [],
      addProgramme: (path, lesson) => {
        const incoming = asLessonList(lesson);
        set((state) => {
          const previous = state.paths.find((item) => item.id === path.id);
          const lessons = { ...state.lessons };
          for (const lessonId of previous?.nodes.flatMap((node) => node.lessonIds) ?? []) {
            if (!incoming.some((item) => item.id === lessonId)) delete lessons[lessonId];
          }
          for (const item of incoming) lessons[item.id] = item;
          return {
            paths: [...state.paths.filter((item) => item.id !== path.id), path],
            lessons,
          };
        });
        void Promise.all(incoming.map(toPublicLesson)).then((publicLessons) => {
          set((state) => ({
            lessons: {
              ...state.lessons,
              ...Object.fromEntries(publicLessons.map((item) => [item.id, item])),
            },
          }));
          void import('@/lib/syncEngine').then((mod) => mod.scheduleCloudSync());
        });
      },
      saveLesson: (lesson) =>
        set((state) => ({ lessons: { ...state.lessons, [lesson.id]: lesson } })),
      removeLesson: (lessonId) =>
        set((state) => {
          const lessons = { ...state.lessons };
          delete lessons[lessonId];
          return { lessons };
        }),
      removeProgramme: (pathId) =>
        set((state) => {
          const target = state.paths.find((path) => path.id === pathId);
          const lessons = { ...state.lessons };
          for (const lessonId of target?.nodes.flatMap((node) => node.lessonIds) ?? []) {
            delete lessons[lessonId];
          }
          return {
            paths: state.paths.filter((path) => path.id !== pathId),
            lessons,
            drafts: state.drafts.map((draft) =>
              draft.id === pathId ? { ...draft, status: 'draft' as const } : draft
            ),
          };
        }),
      saveDraft: (draft) =>
        set((state) => ({
          drafts: [
            ...state.drafts.filter((item) => item.id !== draft.id),
            { ...draft, updatedAt: new Date().toISOString() },
          ],
        })),
      removeDraft: (draftId) =>
        set((state) => ({ drafts: state.drafts.filter((item) => item.id !== draftId) })),
      publishDraft: (draftId) => {
        const draft = get().drafts.find((item) => item.id === draftId);
        if (!draft) return null;
        const built = buildCourseFromDraft({ ...draft, status: 'published' });
        get().addProgramme(built.path, built.lessons);
        set((state) => ({
          drafts: state.drafts.map((item) =>
            item.id === draftId ? { ...item, status: 'published', updatedAt: new Date().toISOString() } : item
          ),
        }));
        return built;
      },
    }),
    {
      name: 'empower-curriculum',
      version: 2,
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<CurriculumState>;
        return {
          paths: state.paths ?? [],
          lessons: state.lessons ?? {},
          drafts: state.drafts ?? [],
        };
      },
    }
  )
);
