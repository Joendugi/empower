import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lesson } from '@cyberlearn/types';
import { getLesson, getNextLessonId } from '@/content';
import { useCurriculumStore } from '@/store/curriculumStore';
import { resolveLesson, useLibraryStore } from '@/store/libraryStore';
import { usePlatformStore } from '@/store/platformStore';
import { completeLesson, gradeExercise } from '@/lib/session';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useLearnerStore } from '@/store/learnerStore';
import ExerciseRouter from '@/components/exercises/ExerciseRouter';
import MediaBlock from '@/components/media/MediaBlock';
import { useT } from '@/i18n';
import type { GradeResult } from '@/components/exercises/types';
import ScenarioLabCard from '@/components/lessons/ScenarioLabCard';
import WeekPreview from '@/components/curriculum/WeekPreview';

export default function LessonPlayerPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const t = useT();
  const language = useLearnerStore((s) => s.language);
  const customLessons = useCurriculumStore((s) => s.lessons);
  const cachedLessons = useLibraryStore((s) => s.lessons);
  const lesson = lessonId
    ? (cachedLessons[lessonId] ?? resolveLesson(lessonId) ?? getLesson(lessonId) ?? customLessons[lessonId])
    : undefined;

  useEffect(() => {
    if (!lessonId) return;
    useLibraryStore.getState().pinLesson(lessonId);
    useAnalyticsStore.getState().record('lesson_start', { lessonId, pathId: lesson?.courseId });
    const nextId = getNextLessonId(lessonId);
    if (nextId) useLibraryStore.getState().prefetchLesson(nextId);
  }, [lessonId, lesson?.courseId]);
  const requireWatch = usePlatformStore((s) => s.requireWatchBeforeContinue);
  const [stage, setStage] = useState<'briefing' | 'exercise'>('briefing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  if (!lesson) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-bold text-white">{t('lessonMissing')}</h1>
        <Link to="/learn/skill-tree" className="btn-primary mt-6">
          {t('back')}
        </Link>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentIndex];
  const progress =
    stage === 'briefing' ? 4 : ((currentIndex + (finished ? 1 : 0)) / lesson.exercises.length) * 100;
  const title = language === 'sw' && lesson.titleSw ? lesson.titleSw : lesson.title;
  const briefing = language === 'sw' && lesson.briefingSw ? lesson.briefingSw : lesson.briefing;
  const lessonMedia = lesson.media ?? [];
  const hasIntro = Boolean(briefing) || lessonMedia.length > 0;
  const mediaLocked =
    lessonMedia.length > 0 && (requireWatch || lessonMedia.some((item) => item.mustFinish));
  const canStart = !mediaLocked || mediaReady;

  const handleAnswer = async (answer: string | string[]): Promise<GradeResult> => {
    const result = await gradeExercise(lesson.id, currentExercise, answer);
    if (result.isCorrect) {
      setXpEarned((value) => value + result.xpAwarded);
    } else {
      setIncorrectCount((c) => c + 1);
    }
    window.setTimeout(async () => {
      if (currentIndex + 1 >= lesson.exercises.length) {
        const complete = await completeLesson(lesson.id);
        if (complete) {
          setXpEarned((value) => value + complete.xpAwarded);
        }
        setFinished(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, result.isCorrect ? 900 : 1200);
    return result;
  };

  if (finished) {
    return <LessonComplete xpEarned={xpEarned} incorrectCount={incorrectCount} lesson={lesson} />;
  }

  return (
    <div className="min-h-dvh bg-primary-dark flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-surface-light">
        <Link to="/learn/skill-tree" className="text-muted hover:text-white text-sm">
          ← {t('back')}
        </Link>
        <div className="flex-1">
          <div className="xp-bar">
            <motion.div className="xp-bar-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        <span className="text-xs text-muted whitespace-nowrap">
          {stage === 'briefing' && hasIntro ? t('briefing') : `${currentIndex + 1}/${lesson.exercises.length}`}
        </span>
        {xpEarned > 0 && <span className="text-xs text-xp font-semibold">+{xpEarned} XP</span>}
      </header>
      <div className="px-4 pt-4 pb-2 max-w-2xl mx-auto w-full">
        <p className="text-[11px] uppercase tracking-wide text-accent font-semibold">
          {lesson.examDomain ?? lesson.cdaccUnitId ?? t('lesson')}
        </p>
        <h1 className="font-display text-xl font-bold text-white mt-1 tracking-tight">{title}</h1>
        <p className="text-xs text-muted mt-1">
          {lesson.estimatedMinutes} {t('minutes')}
        </p>
      </div>
      <main className="flex-1 px-4 pb-8 pt-2 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {stage === 'briefing' && hasIntro ? (
            <motion.section
              key="briefing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {lesson.outline || lesson.weekNumber ? (
                <WeekPreview lesson={lesson} compact onMediaComplete={() => setMediaReady(true)} />
              ) : (
                <div className="space-y-4">
                  <h2 className="font-display text-sm font-semibold text-muted">{t('studyNotes')}</h2>
                  {briefing
                    ? briefing.split(/\n\n+/).map((para, index) => (
                        <p key={index} className="text-white/90 leading-relaxed text-[15px]">
                          {para}
                        </p>
                      ))
                    : null}
                  <MediaBlock assets={lessonMedia} onComplete={() => setMediaReady(true)} />
                </div>
              )}
              <ScenarioLabCard lesson={lesson} />
              <button
                type="button"
                className="btn-primary w-full"
                disabled={!canStart}
                onClick={() => setStage('exercise')}
              >
                {canStart
                  ? lesson.exercises.some((item) => item.type === 'MULTIPLE_CHOICE' || item.type === 'FILL_BLANK')
                    ? t('startAutograde')
                    : t('startExercises')
                  : t('mediaWatchFirst')}
              </button>
            </motion.section>
          ) : (
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <ExerciseRouter
                exercise={currentExercise}
                lessonId={lesson.id}
                onAnswer={handleAnswer}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function LessonComplete({
  xpEarned,
  incorrectCount,
  lesson,
}: {
  xpEarned: number;
  incorrectCount: number;
  lesson: Lesson;
}) {
  const t = useT();
  const navigate = useNavigate();
  const nextId = getNextLessonId(lesson.id);
  const accuracy = Math.round(((lesson.exercises.length - incorrectCount) / lesson.exercises.length) * 100);
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <p className="section-kicker mb-3">{t('moduleComplete')}</p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2 animate-rise-in">
        {t('lessonComplete')}
      </h2>
      <p className="text-muted mb-3 max-w-sm animate-rise-in-delay">{lesson.title}</p>
      <p className="text-sm text-muted mb-10 animate-rise-in-late">
        +{xpEarned} XP · {accuracy}% {t('accuracy').toLowerCase()}
      </p>
      <div className="w-full max-w-xs space-y-3 animate-rise-in-late">
        {nextId && (
          <button className="btn-primary w-full" onClick={() => navigate(`/learn/lesson/${nextId}`)}>
            {t('nextLesson')}
          </button>
        )}
        <button className={nextId ? 'btn-secondary w-full' : 'btn-primary w-full'} onClick={() => navigate('/learn/skill-tree')}>
          {t('continueLearning')}
        </button>
      </div>
    </div>
  );
}
