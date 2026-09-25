import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import type { ProgrammeTrack, SkillPath } from '@cyberlearn/types';
import CourseCard from '@/components/courses/CourseCard';
import LanguagePicker from '@/components/ui/LanguagePicker';
import BrandMark from '@/components/ui/BrandMark';
import { getSkillPaths } from '@/content';
import { programmeProgress } from '@/lib/progress';
import { useCurriculumStore } from '@/store/curriculumStore';
import { useLearnerStore, type LearnerGoal, type LearnerRole } from '@/store/learnerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useT } from '@/i18n';
import type { StringKey } from '@/i18n/strings';

const ROLES: LearnerRole[] = ['student', 'artisan', 'jobseeker', 'community', 'trainer'];
const GOALS: LearnerGoal[] = ['certificate', 'work', 'enterprise', 'community', 'exam'];
const TRACKS: Array<ProgrammeTrack | 'all'> = ['all', 'trades', 'tvet', 'cybersecurity'];

export default function OnboardingPage() {
  const t = useT();
  const navigate = useNavigate();
  const language = useLearnerStore((state) => state.language);
  const displayName = useLearnerStore((state) => state.displayName);
  const completedLessonIds = useLearnerStore((state) => state.completedLessonIds);
  const completeOnboarding = useLearnerStore((state) => state.completeOnboarding);
  const choosePath = useLearnerStore((state) => state.choosePath);
  const customPaths = useCurriculumStore((state) => state.paths);
  const paths = useMemo(() => getSkillPaths(), [customPaths]);

  const [step, setStep] = useState(0);
  const [role, setRole] = useState<LearnerRole>('student');
  const [goal, setGoal] = useState<LearnerGoal>('certificate');
  const [track, setTrack] = useState<ProgrammeTrack | 'all'>('all');
  const [pathId, setPathId] = useState<string | null>(null);

  const suggested = useMemo(() => {
    return paths.filter((path) => {
      if (track !== 'all' && path.track !== track) return false;
      if (goal === 'exam') return path.track === 'tvet' || path.track === 'cybersecurity';
      if (goal === 'enterprise') return path.id === 'digital-enterprise' || path.track === 'trades';
      if (goal === 'community') {
        return [
          'solar-energy',
          'community-health-support',
          'caregiving-assistance',
          'waste-recycling',
          'water-sanitation-hygiene',
          'agriculture',
          'plumbing',
        ].includes(path.id);
      }
      if (goal === 'work') return path.track === 'trades' || path.track === 'tvet';
      return true;
    });
  }, [goal, paths, track]);
  const visibleCourses = suggested.length ? suggested : paths;

  const selected = paths.find((path) => path.id === pathId);
  const totalSteps = 6;

  const finish = (course: SkillPath) => {
    choosePath(course.id);
    useLibraryStore.getState().selectProgramme(course.id);
    completeOnboarding({ role, goal, track, pathId: course.id });
    navigate(`/learn/course/${course.id}`);
  };

  const next = () => setStep((value) => Math.min(value + 1, totalSteps - 1));
  const back = () => setStep((value) => Math.max(value - 1, 0));

  return (
    <div className="min-h-dvh bg-primary-dark text-white">
      <header className="px-4 py-4 border-b border-surface-light">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <BrandMark size="sm" />
          <div className="flex-1">
            <p className="text-xs text-muted">
              {t('onboardStep')} {step + 1} / {totalSteps}
            </p>
            <div className="xp-bar mt-2">
              <div className="xp-bar-fill" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {step === 0 && (
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t('onboardKicker')}</p>
            <h1 className="text-3xl font-bold">
              {displayName ? `${t('onboardWelcome')}, ${displayName}` : t('onboardWelcome')}
            </h1>
            <p className="text-muted leading-relaxed">{t('onboardWelcomeBody')}</p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[t('onboardPoint1'), t('onboardPoint2'), t('onboardPoint3'), t('onboardPoint4')].map((item) => (
                <li key={item} className="card text-sm leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-4">
            <h1 className="text-3xl font-bold">{t('onboardLanguageTitle')}</h1>
            <p className="text-muted leading-relaxed">{t('onboardLanguageBody')}</p>
            <LanguagePicker />
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <h1 className="text-3xl font-bold">{t('onboardRoleTitle')}</h1>
            <p className="text-muted leading-relaxed">{t('onboardRoleBody')}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {ROLES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={clsx(
                    'card text-left',
                    role === item ? 'border-accent' : 'hover:border-accent/40'
                  )}
                >
                  <h2 className="font-semibold">{t(`role_${item}` as StringKey)}</h2>
                  <p className="text-sm text-muted mt-1">{t(`role_${item}_body` as StringKey)}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <h1 className="text-3xl font-bold">{t('onboardGoalTitle')}</h1>
            <p className="text-muted leading-relaxed">{t('onboardGoalBody')}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {GOALS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGoal(item)}
                  className={clsx(
                    'card text-left',
                    goal === item ? 'border-accent' : 'hover:border-accent/40'
                  )}
                >
                  <h2 className="font-semibold">{t(`goal_${item}` as StringKey)}</h2>
                  <p className="text-sm text-muted mt-1">{t(`goal_${item}_body` as StringKey)}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-4">
            <h1 className="text-3xl font-bold">{t('onboardTrackTitle')}</h1>
            <p className="text-muted leading-relaxed">{t('onboardTrackBody')}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {TRACKS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTrack(item)}
                  className={clsx(
                    'card text-left',
                    track === item ? 'border-accent' : 'hover:border-accent/40'
                  )}
                >
                  <h2 className="font-semibold">{item === 'all' ? t('allProgrammes') : t(item === 'trades' ? 'tradesTrack' : item === 'tvet' ? 'tvetTrack' : 'cyberTrack')}</h2>
                  <p className="text-sm text-muted mt-1">
                    {item === 'all'
                      ? t('onboardTrackAll')
                      : item === 'trades'
                        ? t('tradesCardBody')
                        : item === 'tvet'
                          ? t('tvetCardBody')
                          : t('cyberCardBody')}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="space-y-4">
            <h1 className="text-3xl font-bold">{t('onboardCourseTitle')}</h1>
            <p className="text-muted leading-relaxed">{t('onboardCourseBody')}</p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {visibleCourses.map((path) => (
                <li key={path.id}>
                  <CourseCard
                    path={path}
                    language={language}
                    progress={programmeProgress(path, completedLessonIds)}
                    chosen={path.id === pathId}
                    onOpen={() => setPathId(path.id)}
                  />
                </li>
              ))}
            </ul>
            {selected && (
              <div className="card border-accent/40">
                <p className="text-xs uppercase tracking-wider text-accent">{t('courseChosen')}</p>
                <h2 className="font-semibold mt-1">{language === 'sw' && selected.titleSw ? selected.titleSw : selected.title}</h2>
                <p className="text-sm text-muted mt-2">{t('onboardReadyBody')}</p>
              </div>
            )}
          </section>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {step > 0 && (
            <button type="button" className="btn-secondary" onClick={back}>
              {t('back')}
            </button>
          )}
          {step < 5 ? (
            <button type="button" className="btn-primary flex-1" onClick={next}>
              {t('onboardContinue')}
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary flex-1"
              disabled={!selected}
              onClick={() => selected && finish(selected)}
            >
              {t('onboardFinish')}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
