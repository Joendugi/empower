import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import type { ProgrammeTrack } from '@cyberlearn/types';
import { getLesson, getSkillPaths } from '@/content';
import CourseCard from '@/components/courses/CourseCard';
import AppHeader from '@/components/ui/AppHeader';
import SearchField from '@/components/ui/SearchField';
import BottomNav from '@/components/ui/BottomNav';
import { programmeProgress } from '@/lib/progress';
import { useCurriculumStore } from '@/store/curriculumStore';
import { useLearnerStore, xpToLevel } from '@/store/learnerStore';
import { resolveLesson } from '@/store/libraryStore';
import { useT } from '@/i18n';
import { MAX_ACTIVE_COURSES } from '@/lib/activeCourses';

export default function SkillTreePage() {
  const t = useT();
  const navigate = useNavigate();
  const language = useLearnerStore((state) => state.language);
  const xp = useLearnerStore((state) => state.xp);
  const completedLessonIds = useLearnerStore((state) => state.completedLessonIds);
  const chosenPathIds = useLearnerStore((state) => state.chosenPathIds);
  const [params, setParams] = useSearchParams();
  const requested = params.get('track');
  const query = params.get('q') ?? '';
  const track: ProgrammeTrack | 'all' =
    requested === 'tvet' || requested === 'cybersecurity' || requested === 'trades' ? requested : 'all';
  const customPaths = useCurriculumStore((state) => state.paths);
  const paths = useMemo(() => getSkillPaths(), [customPaths]);
  const needle = query.trim().toLowerCase();
  const level = xpToLevel(xp);

  const matches = (path: (typeof paths)[number]) => {
    if (track !== 'all' && path.track !== track) return false;
    if (!needle) return true;
    const lessonTitles = path.nodes.flatMap((node) =>
      node.lessonIds.map((id) => {
        const lesson = resolveLesson(id) ?? getLesson(id);
        return `${lesson?.title ?? ''} ${lesson?.titleSw ?? ''}`;
      })
    );
    return [path.title, path.titleSw, path.description, path.certificationTarget, ...path.nodes.map((node) => `${node.title} ${node.titleSw ?? ''} ${node.description}`), ...lessonTitles]
      .join(' ')
      .toLowerCase()
      .includes(needle);
  };

  const mine = paths.filter((path) => chosenPathIds.includes(path.id) && matches(path));
  const browse = paths.filter((path) => !chosenPathIds.includes(path.id) && matches(path));

  const selectTrack = (next: ProgrammeTrack | 'all') => {
    const nextParams = new URLSearchParams(params);
    if (next === 'all') nextParams.delete('track');
    else nextParams.set('track', next);
    setParams(nextParams, { replace: true });
  };

  const openCourse = (pathId: string) => navigate(`/learn/course/${pathId}`);

  return (
    <div className="min-h-dvh pb-24 text-white">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 pt-6">
        <p className="section-kicker animate-rise-in">{t('catalogueKicker')}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3 animate-rise-in">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {t('chooseCourseTitle')}
          </h1>
          <p className="text-xs text-muted tabular-nums">
            Lvl {level} · {xp.toLocaleString()} XP
          </p>
        </div>
        <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed animate-rise-in-delay">
          {t('chooseCourseBody')}
        </p>

        <div className="mt-5 max-w-xl animate-rise-in-delay">
          <SearchField
            value={query}
            onChange={(value) => {
              const next = new URLSearchParams(params);
              if (value) next.set('q', value);
              else next.delete('q');
              setParams(next, { replace: true });
            }}
            placeholder={t('searchProgrammes')}
          />
        </div>

        <div className="segmented mt-4 mb-8 animate-rise-in-late" role="group" aria-label={t('allProgrammes')}>
          {(
            [
              ['all', t('allProgrammes')],
              ['trades', t('tradesTrack')],
              ['tvet', t('tvetTrack')],
              ['cybersecurity', t('cyberTrack')],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => selectTrack(id)}
              className={clsx('segmented-item', track === id && 'segmented-item--active')}
            >
              {label}
            </button>
          ))}
        </div>

        {mine.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-lg font-semibold mb-3">
              {t('myCourses')}{' '}
              <span className="text-sm font-normal text-muted">
                ({chosenPathIds.length}/{MAX_ACTIVE_COURSES} {t('activeCoursesLabel').toLowerCase()})
              </span>
            </h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mine.map((path) => (
                <li key={path.id}>
                  <CourseCard
                    path={path}
                    language={language}
                    chosen
                    progress={programmeProgress(path, completedLessonIds)}
                    onOpen={() => openCourse(path.id)}
                  />
                </li>
              ))}
            </ul>
            {chosenPathIds.length >= MAX_ACTIVE_COURSES && (
              <p className="text-xs text-muted mt-3">{t('courseSlotsFull')}</p>
            )}
          </section>
        )}

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">
            {mine.length ? t('browseCourses') : t('chooseCourseTitle')}
          </h2>
          {browse.length === 0 && mine.length === 0 ? (
            <p className="text-muted py-6">{t('noSearchResults')}</p>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {browse.map((path) => (
                <li key={path.id}>
                  <CourseCard
                    path={path}
                    language={language}
                    progress={programmeProgress(path, completedLessonIds)}
                    onOpen={() => openCourse(path.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
