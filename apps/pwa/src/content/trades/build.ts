import type { Lesson, MediaAsset, SkillPath } from '@cyberlearn/types';
import { diagramLabel, fillBlank, makeLesson, mcq, mediaWatch, nodeFromLessons, scenario } from '../helpers';

export type Choice = 'a' | 'b' | 'c' | 'd';

export interface McqSpec {
  prompt: string;
  options: [string, string, string, string];
  correct: Choice;
  hint: string;
  explanation: string;
}

export interface BlankSpec {
  prompt: string;
  answer: string;
  hint: string;
  explanation: string;
}

export interface TradeModule {
  slug: string;
  title: string;
  titleSw: string;
  description: string;
  minutes?: number;
  cdacc?: string;
  examDomain?: string;
  briefing: string;
  briefingSw: string;
  media?: MediaAsset[];
  watchMedia?: MediaAsset[];
  watchPrompt?: string;
  blanks?: BlankSpec[];
  diagram?: {
    kind: string;
    prompt: string;
    slots: Array<{ id: string; label: string; x: number; y: number }>;
    hint: string;
    explanation: string;
  };
  questions: McqSpec[];
  practice: McqSpec;
  practical?: {
    type: 'video' | 'audio' | 'photo';
    prompt: string;
    rubric: string[];
    minSeconds?: number;
  };
}

export interface TradeProgramme {
  id: string;
  title: string;
  titleSw: string;
  description: string;
  descriptionSw: string;
  icon: string;
  certificationTarget?: string;
  modules: TradeModule[];
}

export function buildTradeProgramme(spec: TradeProgramme): { lessons: Lesson[]; path: SkillPath } {
  const lessons = spec.modules.map((mod) => {
    const id = `${spec.id}-${mod.slug}`;
    return makeLesson({
      id: `${id}-lesson`,
      courseId: spec.id,
      title: mod.title,
      titleSw: mod.titleSw,
      briefing: mod.briefing,
      briefingSw: mod.briefingSw,
      estimatedMinutes: mod.minutes ?? 18,
      cdaccUnitId: mod.cdacc,
      examDomain: mod.examDomain ?? 'CDACC / NITA polytechnic trade',
      media: mod.media,
      exercises: [
        ...(mod.watchMedia?.length
          ? [
              mediaWatch(
                `${id}-media`,
                mod.watchPrompt ?? 'Watch the workshop demonstration, then confirm.',
                mod.watchMedia
              ),
            ]
          : []),
        ...mod.questions.map((question, index) =>
          mcq(
            `${id}-q${index + 1}`,
            question.prompt,
            question.options,
            question.correct,
            question.hint,
            question.explanation
          )
        ),
        ...(mod.blanks ?? []).map((blank, index) =>
          fillBlank(`${id}-fb${index + 1}`, blank.prompt, blank.answer, blank.hint, blank.explanation)
        ),
        ...(mod.diagram
          ? [
              diagramLabel(
                `${id}-diagram`,
                mod.diagram.prompt,
                mod.diagram.slots,
                mod.diagram.hint,
                mod.diagram.explanation,
                mod.diagram.kind
              ),
            ]
          : []),
        scenario(
          `${id}-scenario`,
          mod.practice.prompt,
          mod.practice.options,
          mod.practice.correct,
          mod.practice.hint,
          mod.practice.explanation
        ),
        ...(mod.practical
          ? [
              {
                id: `${id}-practical`,
                type: {
                  video: 'VIDEO_RECORD',
                  audio: 'AUDIO_RECORD',
                  photo: 'PHOTO_CAPTURE',
                }[mod.practical.type] as 'VIDEO_RECORD' | 'AUDIO_RECORD' | 'PHOTO_CAPTURE',
                prompt: mod.practical.prompt,
                correctAnswer: {
                  video: 'recorded',
                  audio: 'spoken',
                  photo: 'captured',
                }[mod.practical.type],
                hint: 'Show the procedure safely and check every rubric item before submitting.',
                explanation: 'Practical evidence saved locally for trainer review.',
                rubric: mod.practical.rubric,
                minSeconds: mod.practical.minSeconds,
                xpReward: 80,
              },
            ]
          : []),
      ],
    });
  });

  const path: SkillPath = {
    id: spec.id,
    track: 'trades',
    contentVersion: '1',
    title: spec.title,
    titleSw: spec.titleSw,
    description: spec.description,
    descriptionSw: spec.descriptionSw,
    certificationTarget: spec.certificationTarget ?? `CDACC / NITA — ${spec.title}`,
    nodes: spec.modules.map((mod, index) =>
      nodeFromLessons({
        id: `${spec.id}-${mod.slug}`,
        title: mod.title,
        titleSw: mod.titleSw,
        description: mod.description,
        icon: spec.icon,
        prerequisites: index === 0 ? [] : [`${spec.id}-${spec.modules[index - 1].slug}`],
        cdaccUnitId: mod.cdacc,
        examDomain: mod.examDomain ?? 'Polytechnic trade',
        lessons: [lessons[index]],
      })
    ),
  };

  return { lessons, path };
}

export function allFromProgrammes(programmes: TradeProgramme[]) {
  const bundles = programmes.map(buildTradeProgramme);
  return {
    tradeLessons: bundles.flatMap((bundle) => bundle.lessons),
    tradePaths: bundles.map((bundle) => bundle.path),
  };
}
