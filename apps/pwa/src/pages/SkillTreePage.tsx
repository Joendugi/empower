import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { Map, LayoutGrid } from 'lucide-react';
import type { ProgrammeTrack } from '@cyberlearn/types';
import { getLesson, getSkillPaths } from '@/content';
import CourseCard from '@/components/courses/CourseCard';
import AppHeader from '@/components/ui/AppHeader';
import SearchField from '@/components/ui/SearchField';
import BottomNav from '@/components/ui/BottomNav';
import XPBar from '@/components/gamification/XPBar';
import { CivilizationMapView } from '@/components/narrative/CivilizationMapView';
import { programmeProgress } from '@/lib/progress';
import { useCurriculumStore } from '@/store/curriculumStore';
import { useIsEducator } from '@/lib/roles';
import { useLearnerStore } from '@/store/learnerStore';
import { resolveLesson } from '@/store/libraryStore';
import { useT } from '@/i18n';

export default function SkillTreePage() {
  const t = useT();
  const navigate = useNavigate();
  const language = useLearnerStore((state) => state.language);
  const xp = useLearnerStore((state) => state.xp);
  const completedLessonIds = useLearnerStore((state) => state.completedLessonIds);
  const chosenPathIds = useLearnerStore((state) => state.chosenPathIds);
  const teaching = useIsEducator();
  const [params, setParams] = useSearchParams();
  const requested = params.get('track');
  const query = params.get('q') ?? '';
  const track: ProgrammeTrack | 'all' =
    requested === 'tvet' || requested === 'cybersecurity' || requested === 'trades' ? requested : 'all';
  const customPaths = useCurriculumStore((state) => state.paths);
  const cloudPaths = useCurriculumStore((state) => state.cloudPaths);
  const paths = useMemo(() => getSkillPaths(), [customPaths, cloudPaths]);

  useEffect(() => {
    void useCurriculumStore.getState().syncCurriculum();
  }, []);
  const needle = query.trim().toLowerCase();

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

  const [viewMode, setViewMode] = useState<'catalogue' | 'map'>('catalogue');

  return (
    <div className="min-h-dvh bg-primary-dark pb-24 text-white">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 pt-6">
        <div className="mb-5">
          <XPBar totalXp={xp} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t('catalogueKicker')}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
              {viewMode === 'map'
                ? (language === 'sw' ? 'Ramani ya Miundombinu' : 'Civilization Map Grid')
                : t('chooseCourseTitle')}
            </h1>
          </div>

          {/* View Mode Toggle Button */}
          <div className="flex items-center gap-1 bg-surface-dark border border-surface-light/40 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('catalogue')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                viewMode === 'catalogue' ? 'bg-accent text-primary font-bold shadow-sm' : 'text-muted hover:text-white'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Orodha' : 'Catalogue'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                viewMode === 'map' ? 'bg-emerald-500 text-black font-bold shadow-sm' : 'text-muted hover:text-white'
              )}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Ramani & Dira' : 'Civilization Map'}</span>
            </button>
          </div>
        </div>

        {viewMode === 'map' ? (
          <div className="mt-6">
            <CivilizationMapView
              completedLessonIds={completedLessonIds}
              language={language}
              onOpenNode={(node) => {
                if (node.pathId) {
                  openCourse(node.pathId);
                }
              }}
            />
          </div>
        ) : (
          <>
            <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">
              {teaching
                ? 'Browse programmes to grade work and attach library notes. You do not start learner lessons from here.'
                : t('chooseCourseBody')}
            </p>
        {teaching && (
          <Link to="/educator" className="btn-primary mt-4 inline-flex text-sm">
            Open teaching desk
          </Link>
        )}

        <div className="mt-5 max-w-xl">
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

        <div className="flex flex-wrap gap-2 mt-4 mb-8">
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
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm border transition-colors',
                track === id
                  ? 'bg-accent text-primary border-accent font-semibold'
                  : 'border-surface-light text-muted hover:text-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {mine.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3">{t('myCourses')}</h2>
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
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-3">{mine.length ? t('browseCourses') : t('chooseCourseTitle')}</h2>
          {browse.length === 0 && mine.length === 0 ? (
            <p className="card text-muted">{t('noSearchResults')}</p>
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
        </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
