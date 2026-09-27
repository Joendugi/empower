import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  ArrowLeft, 
  Layers, 
  MapPin, 
  BookOpen, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { getSkillPaths } from '@/content';
import AppHeader from '@/components/ui/AppHeader';
import BottomNav from '@/components/ui/BottomNav';
import CourseOutline from '@/components/curriculum/CourseOutline';
import InteractiveRoadmap from '@/components/curriculum/InteractiveRoadmap';
import CourseDownloadButton from '@/components/offline/CourseDownloadButton';
import { courseIcon, courseLessonCount } from '@/lib/courseMeta';
import { programmeProgress } from '@/lib/progress';
import { useCurriculumStore } from '@/store/curriculumStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useLearnerStore } from '@/store/learnerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useT } from '@/i18n';

export default function CoursePage() {
  const t = useT();
  const navigate = useNavigate();
  const { pathId } = useParams<{ pathId: string }>();
  const [viewMode, setViewMode] = useState<'roadmap' | 'syllabus'>('roadmap');

  const language = useLearnerStore((state) => state.language);
  const signedIn = Boolean(useLearnerStore((state) => state.token));
  const completedLessonIds = useLearnerStore((state) => state.completedLessonIds);
  const chosenPathIds = useLearnerStore((state) => state.chosenPathIds);
  const choosePath = useLearnerStore((state) => state.choosePath);
  const customPaths = useCurriculumStore((state) => state.paths);
  const cloudPaths = useCurriculumStore((state) => state.cloudPaths);
  const path = useMemo(() => getSkillPaths().find((item) => item.id === pathId), [pathId, customPaths, cloudPaths]);

  useEffect(() => {
    void useCurriculumStore.getState().syncCurriculum();
    if (pathId) useAnalyticsStore.getState().record('course_open', { pathId });
  }, [pathId]);

  if (!path) {
    return (
      <div className="min-h-dvh bg-primary-dark text-white grid place-items-center px-6">
        <div className="card text-center max-w-sm !p-8 border-white/[0.08]">
          <h1 className="text-xl font-bold">{t('courseMissing')}</h1>
          <Link to="/learn/skill-tree" className="btn-primary mt-6 inline-flex">
            <ArrowLeft className="w-4 h-4" /> {t('chooseCourseTitle')}
          </Link>
        </div>
      </div>
    );
  }

  const progress = programmeProgress(path, completedLessonIds);
  const chosen = chosenPathIds.includes(path.id);
  const title = language === 'sw' && path.titleSw ? path.titleSw : path.title;
  const description = language === 'sw' && path.descriptionSw ? path.descriptionSw : path.description;
  const firstLesson = progress.nextLessonId ?? path.nodes[0]?.lessonIds[0];
  const isTvet = path.track === 'tvet';
  const isTrades = path.track === 'trades';
  const trackLabel = isTrades ? t('tradesTrack') : isTvet ? t('tvetTrack') : t('cyberTrack');

  const choose = () => {
    choosePath(path.id);
    useLibraryStore.getState().selectProgramme(path.id);
  };

  const openLesson = (lessonId: string) => {
    choose();
    const dest = `/learn/lesson/${lessonId}`;
    if (!signedIn) {
      navigate(`/login?next=${encodeURIComponent(dest)}`);
      return;
    }
    navigate(dest);
  };

  const start = () => {
    if (firstLesson) openLesson(firstLesson);
  };

  return (
    <div className="min-h-dvh bg-primary-dark pb-28 text-white">
      <AppHeader home="/learn/skill-tree" />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Link 
          to="/learn/skill-tree" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t('chooseCourseTitle')}
        </Link>

        {/* Hero Course Overview Card */}
        <div className="card !p-6 sm:!p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-surface-light border border-white/[0.1] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                {courseIcon(path)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={clsx(
                      'text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border',
                      isTrades
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                        : isTvet
                          ? 'bg-blue-500/15 text-blue-300 border-blue-500/25'
                          : 'bg-accent/15 text-accent border-accent/25'
                    )}
                  >
                    {trackLabel}
                  </span>
                  {chosen && (
                    <span className="badge-accent text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> Enrolled
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">{title}</h1>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
              <span className="text-xs text-muted flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {path.nodes.length} {t('modules')} · {courseLessonCount(path)} {t('lessons')}
              </span>
              {progress.done > 0 && (
                <span className="text-sm font-semibold text-accent">
                  {progress.percent}% Complete
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-light mt-4 leading-relaxed max-w-2xl">{description}</p>

          {path.certificationTarget && (
            <p className="text-xs text-accent mt-2 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {path.certificationTarget}
            </p>
          )}

          {/* Progress Bar */}
          {progress.done > 0 && (
            <div className="xp-bar mt-4">
              <div className="xp-bar-fill" style={{ width: `${progress.percent}%` }} />
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!chosen && (
              <button type="button" className="btn-secondary py-3 text-xs font-semibold" onClick={choose}>
                {t('chooseThisCourse')}
              </button>
            )}
            <button
              type="button"
              className="btn-primary py-3 text-xs font-bold flex-1"
              onClick={start}
              disabled={!firstLesson}
            >
              <Play className="w-4 h-4 fill-current" />
              {progress.done > 0 ? t('continueCourse') : t('startChosenCourse')}
            </button>
            <CourseDownloadButton path={path} className="shrink-0" />
          </div>

          {!signedIn && (
            <div className="mt-4 p-3.5 rounded-xl bg-accent/[0.08] border border-accent/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-accent shrink-0" />
                <p className="text-xs text-muted-light">
                  <strong className="text-white">Browse freely.</strong> Sign in to start a graded lesson, save XP, and earn certificates.
                </p>
              </div>
              <Link 
                to={`/login?next=${encodeURIComponent(`/learn/course/${path.id}`)}`}
                className="btn-secondary !py-1.5 !px-3 text-xs font-semibold whitespace-nowrap shrink-0"
              >
                Open Account
              </Link>
            </div>
          )}
        </div>

        {/* View Mode Switcher (Roadmap vs Syllabus) */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Learning Journey
          </h2>
          <div className="p-1 rounded-xl bg-surface border border-white/[0.08] flex gap-1">
            <button
              type="button"
              onClick={() => setViewMode('roadmap')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all',
                viewMode === 'roadmap'
                  ? 'bg-accent text-white'
                  : 'text-muted hover:text-white'
              )}
            >
              <MapPin className="w-3.5 h-3.5" />
              Roadmap
            </button>
            <button
              type="button"
              onClick={() => setViewMode('syllabus')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all',
                viewMode === 'syllabus'
                  ? 'bg-accent text-white'
                  : 'text-muted hover:text-white'
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Syllabus
            </button>
          </div>
        </div>

        {/* Main Content: Interactive Roadmap vs Outline */}
        {viewMode === 'roadmap' ? (
          <div className="card !p-4">
            <InteractiveRoadmap
              path={path}
              completedLessonIds={completedLessonIds}
              onOpenLesson={openLesson}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <CourseOutline
              path={path}
              completedLessonIds={completedLessonIds}
              onOpenWeek={openLesson}
            />
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
