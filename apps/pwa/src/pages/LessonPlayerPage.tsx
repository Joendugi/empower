import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Layers 
} from 'lucide-react';
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
import { triggerConfettiBurst, triggerLevelUpCelebration } from '@/lib/confetti';
import { playSuccessChime, playIncorrectChime, playLevelUpFanfare } from '@/lib/soundEffects';
import DiscussionBoard from '@/components/curriculum/DiscussionBoard';

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
      <div className="min-h-dvh bg-primary-dark flex flex-col items-center justify-center px-6 text-center">
        <div className="card max-w-md w-full !p-8 text-center border-white/[0.08]">
          <h1 className="text-xl font-bold text-white mb-2">{t('lessonMissing')}</h1>
          <p className="text-xs text-muted mb-6">The requested module content could not be found or loaded.</p>
          <Link to="/learn/skill-tree" className="btn-primary w-full text-sm">
            <ArrowLeft className="w-4 h-4" /> {t('back')}
          </Link>
        </div>
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
      playSuccessChime();
      triggerConfettiBurst({ particleCount: 25, spread: 45 });
    } else {
      setIncorrectCount((c) => c + 1);
      playIncorrectChime();
    }
    window.setTimeout(async () => {
      if (currentIndex + 1 >= lesson.exercises.length) {
        const complete = await completeLesson(lesson.id);
        if (complete) {
          setXpEarned((value) => value + complete.xpAwarded);
        }
        setFinished(true);
        playLevelUpFanfare();
        triggerLevelUpCelebration();
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, result.isCorrect ? 800 : 1100);
    return result;
  };

  if (finished) {
    return <LessonComplete xpEarned={xpEarned} incorrectCount={incorrectCount} lesson={lesson} />;
  }

  return (
    <div className="min-h-dvh bg-primary-dark flex flex-col bg-grid-pattern">
      {/* Top Header bar with progress */}
      <header className="sticky top-0 z-30 bg-primary-dark/85 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link 
            to="/learn/skill-tree" 
            className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/[0.06] transition-colors"
            title={t('back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex-1">
            <div className="xp-bar">
              <motion.div 
                className="xp-bar-fill" 
                animate={{ width: `${progress}%` }} 
                transition={{ duration: 0.4 }} 
              />
            </div>
          </div>

          <span className="text-xs font-mono font-medium text-muted px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
            {stage === 'briefing' && hasIntro ? t('briefing') : `${currentIndex + 1} / ${lesson.exercises.length}`}
          </span>

          {xpEarned > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-yellow-400 font-bold bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full shadow-glow-xp animate-bounce-once">
              <Sparkles className="w-3 h-3" />
              +{xpEarned} XP
            </span>
          )}
        </div>
      </header>

      {/* Lesson Title & Topic Banner */}
      <div className="px-4 pt-5 pb-2 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="badge-accent text-[10px] uppercase font-mono tracking-wider">
            {lesson.examDomain ?? lesson.cdaccUnitId ?? t('lesson')}
          </span>
          <span className="text-xs text-muted flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {lesson.estimatedMinutes} {t('minutes')}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-2 tracking-tight">{title}</h1>
      </div>

      {/* Main interactive stage */}
      <main className="flex-1 px-4 pb-12 pt-2 max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {stage === 'briefing' && hasIntro ? (
            <motion.section
              key="briefing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="card space-y-5 border-white/[0.08]"
            >
              {lesson.outline || lesson.weekNumber ? (
                <WeekPreview lesson={lesson} compact onMediaComplete={() => setMediaReady(true)} />
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <h2>{t('studyNotes')}</h2>
                  </div>
                  {briefing
                    ? briefing.split(/\n\n+/).map((para, index) => (
                        <p key={index} className="text-white/90 leading-relaxed text-[15px]">
                          {para}
                        </p>
                      ))
                    : null}
                  <MediaBlock assets={lessonMedia} onComplete={() => setMediaReady(true)} />
                </>
              )}

              <ScenarioLabCard lesson={lesson} />

              <div className="pt-2">
                <button
                  type="button"
                  className="btn-primary w-full py-3.5 text-sm"
                  disabled={!canStart}
                  onClick={() => setStage('exercise')}
                >
                  {canStart ? (
                    <>
                      {lesson.exercises.some((item) => item.type === 'MULTIPLE_CHOICE' || item.type === 'FILL_BLANK')
                        ? t('startAutograde')
                        : t('startExercises')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    t('mediaWatchFirst')
                  )}
                </button>
              </div>
            </motion.section>
          ) : (
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="card !p-6 border-white/[0.08] shadow-2xl"
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
  const totalQuestions = Math.max(1, lesson.exercises.length);
  const accuracy = Math.max(0, Math.round(((totalQuestions - incorrectCount) / totalQuestions) * 100));

  return (
    <div className="min-h-dvh bg-primary-dark flex flex-col items-center justify-center px-6 py-12 text-center bg-grid-pattern relative overflow-hidden">
      {/* Ambient Celebration Glow */}
      <div className="absolute top-1/3 w-[500px] h-[300px] bg-accent/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative card !p-8 sm:!p-10 border-accent/40 max-w-md w-full shadow-2xl shadow-accent/15 backdrop-blur-2xl">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-accent to-emerald-400 text-primary-dark mx-auto flex items-center justify-center mb-6 shadow-glow">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-widest mb-3 border border-accent/30">
          <Sparkles className="w-3.5 h-3.5" />
          {t('moduleComplete')}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{t('lessonComplete')}</h2>
        <p className="text-xs sm:text-sm text-muted mb-8 line-clamp-2">{lesson.title}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-surface-light/60 border border-white/[0.08] text-center">
            <div className="text-3xl font-black text-yellow-400">+{xpEarned}</div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mt-1">XP Earned</div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-light/60 border border-white/[0.08] text-center">
            <div className="text-3xl font-black text-emerald-400">{accuracy}%</div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mt-1">{t('accuracy')}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {nextId && (
            <button 
              className="btn-primary w-full py-3 text-sm" 
              onClick={() => navigate(`/learn/lesson/${nextId}`)}
            >
              <span>{t('nextLesson')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button 
            className={nextId ? 'btn-secondary w-full py-3 text-sm' : 'btn-primary w-full py-3 text-sm'} 
            onClick={() => navigate('/learn/skill-tree')}
          >
            <Layers className="w-4 h-4" />
            <span>{t('continueLearning')}</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mt-6">
        <DiscussionBoard lessonId={lesson.id} />
      </div>
    </div>
  );
}
