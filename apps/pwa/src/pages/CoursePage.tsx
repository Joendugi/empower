import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { getLesson, getSkillPaths } from '@/content';
import AppHeader from '@/components/ui/AppHeader';
import BottomNav from '@/components/ui/BottomNav';
import CourseOutline from '@/components/curriculum/CourseOutline';
import { courseIcon, courseLessonCount } from '@/lib/courseMeta';
import { MAX_ACTIVE_COURSES } from '@/lib/activeCourses';
import { programmeProgress } from '@/lib/progress';
import { useCurriculumStore } from '@/store/curriculumStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useLearnerStore } from '@/store/learnerStore';
import { resolveLesson } from '@/store/libraryStore';
import { useT } from '@/i18n';

export default function CoursePage() {
  const t = useT();
  const navigate = useNavigate();
  const { pathId } = useParams<{ pathId: string }>();
  const language = useLearnerStore((state) => state.language);
  const completedLessonIds = useLearnerStore((state) => state.completedLessonIds);
  const chosenPathIds = useLearnerStore((state) => state.chosenPathIds);
  const choosePath = useLearnerStore((state) => state.choosePath);
  const leavePath = useLearnerStore((state) => state.leavePath);
  const canChoosePath = useLearnerStore((state) => state.canChoosePath);
  const customPaths = useCurriculumStore((state) => state.paths);
  const path = getSkillPaths().find((item) => item.id === pathId);
  void customPaths;

  useEffect(() => {
    if (pathId) useAnalyticsStore.getState().record('course_open', { pathId });
  }, [pathId]);

  if (!path) {
    return (
      <div className="min-h-dvh bg-primary-dark text-white grid place-items-center px-6">
        <div className="text-center">
          <h1 className="text-xl font-bold">{t('courseMissing')}</h1>
          <Link to="/learn/skill-tree" className="btn-primary mt-6 inline-flex">
            {t('chooseCourseTitle')}
          </Link>
        </div>
      </div>
    );
  }

  const progress = programmeProgress(path, completedLessonIds);
  const chosen = chosenPathIds.includes(path.id);
  const slotsFull = !canChoosePath(path.id);
  const title = language === 'sw' && path.titleSw ? path.titleSw : path.title;
  const description = language === 'sw' && path.descriptionSw ? path.descriptionSw : path.description;
  const firstLesson = progress.nextLessonId ?? path.nodes[0]?.lessonIds[0];
  const isTvet = path.track === 'tvet';
  const isTrades = path.track === 'trades';
  const trackLabel = isTrades ? t('tradesTrack') : isTvet ? t('tvetTrack') : t('cyberTrack');

  const choose = () => choosePath(path.id);

  const start = () => {
    if (!chosen && !choosePath(path.id)) return;
    if (firstLesson) navigate(`/learn/lesson/${firstLesson}`);
  };

  const leave = () => leavePath(path.id);

  return (
    <div className="min-h-dvh bg-primary-dark pb-24 text-white">
      <AppHeader home="/learn/skill-tree" />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Link to="/learn/skill-tree" className="text-sm text-muted hover:text-white">
          ← {t('chooseCourseTitle')}
        </Link>
        <div className="card space-y-4">
          <p className="text-4xl">{courseIcon(path)}</p>
          <span
            className={clsx(
              'text-[11px] font-semibold px-2 py-0.5 rounded-full',
              isTrades ? 'bg-amber-500/15 text-amber-200' : isTvet ? 'bg-blue-500/15 text-blue-300' : 'bg-accent/10 text-accent'
            )}
          >
            {trackLabel}
          </span>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted leading-relaxed">{description}</p>
          {path.certificationTarget && <p className="text-sm text-accent">{path.certificationTarget}</p>}
          <p className="text-sm text-muted">
            {path.nodes.length} {t('modules')} · {courseLessonCount(path)} {t('lessons')}
            {progress.done > 0 ? ` · ${progress.percent}%` : ''}
          </p>
          <p className="text-xs text-muted">
            {t('activeCoursesLabel')}: {chosenPathIds.length}/{MAX_ACTIVE_COURSES}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {!chosen && (
              <button type="button" className="btn-primary" onClick={choose} disabled={slotsFull}>
                {t('chooseThisCourse')}
              </button>
            )}
            {chosen && (
              <button type="button" className="btn-secondary" onClick={leave}>
                {t('leaveCourse')}
              </button>
            )}
            <button
              type="button"
              className={chosen ? 'btn-primary' : 'btn-secondary'}
              onClick={start}
              disabled={!firstLesson || (!chosen && slotsFull)}
            >
              {progress.done > 0 ? t('continueCourse') : t('startChosenCourse')}
            </button>
          </div>
          {chosen && <p className="text-xs text-success">{t('courseChosen')}</p>}
          {slotsFull && <p className="text-xs text-amber-200">{t('courseSlotsFull')}</p>}
        </div>

        {path.nodes.some((node) => node.weekNumber) || path.id.startsWith('custom-') ? (
          <CourseOutline
            path={path}
            completedLessonIds={completedLessonIds}
            onOpenWeek={(lessonId) => {
              if (!chosen && !choosePath(path.id)) return;
              navigate(`/learn/lesson/${lessonId}`);
            }}
          />
        ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">{t('courseUnits')}</h2>
          {path.nodes.map((node, index) => {
            const nodeTitle = language === 'sw' && node.titleSw ? node.titleSw : node.title;
            const prereqMet = (node.prerequisites ?? []).every((id) => {
              const required = path.nodes.find((item) => item.id === id);
              if (!required?.lessonIds.length) return true;
              return required.lessonIds.every((lessonId) => completedLessonIds.includes(lessonId));
            });
            const locked = Boolean(node.prerequisites?.length) && !prereqMet;
            return (
              <article key={node.id} className={clsx('card', locked && 'opacity-55')}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{locked ? '🔒' : node.icon ?? courseIcon(path)}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">
                      <span className="text-muted font-normal mr-2">{index + 1}.</span>
                      {nodeTitle}
                    </h3>
                    <p className="text-sm text-muted mt-1">{node.description}</p>
                    {!locked && (
                      <ul className="mt-3 space-y-1.5">
                        {node.lessonIds.map((id, lessonIndex) => {
                          const lesson = resolveLesson(id) ?? getLesson(id);
                          const lessonTitle =
                            language === 'sw' && lesson?.titleSw ? lesson.titleSw : lesson?.title ?? id;
                          const done = completedLessonIds.includes(id);
                          return (
                            <li key={id}>
                              <Link
                                to={`/learn/lesson/${id}`}
                                onClick={(event) => {
                                  if (!chosen && !choosePath(path.id)) {
                                    event.preventDefault();
                                  }
                                }}
                                className="text-sm text-accent hover:underline inline-flex items-baseline gap-2"
                              >
                                <span className="text-muted">{done ? '✓' : `${lessonIndex + 1}.`}</span>
                                <span>{lessonTitle}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {locked && <p className="text-xs text-muted mt-2">{t('locked')}</p>}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
