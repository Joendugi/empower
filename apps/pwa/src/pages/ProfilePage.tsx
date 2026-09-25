import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import AppHeader from '@/components/ui/AppHeader';
import BottomNav from '@/components/ui/BottomNav';
import LanguagePicker from '@/components/ui/LanguagePicker';
import StreakBadge from '@/components/gamification/StreakBadge';
import XPBar from '@/components/gamification/XPBar';
import { allProgrammeProgress, deriveAchievements } from '@/lib/progress';
import { isLocalToken } from '@/lib/localApi';
import { useLearnerStore } from '@/store/learnerStore';
import { useT } from '@/i18n';
import type { StringKey } from '@/i18n/strings';

export default function ProfilePage() {
  const t = useT();
  const navigate = useNavigate();
  const {
    displayName,
    email,
    xp,
    level,
    streak,
    longestStreak,
    token,
    completedLessonIds,
    chosenPathIds,
    reset,
    setDisplayName,
    restartOnboarding,
  } = useLearnerStore();
  const signedIn = Boolean(token);
  const localSession = isLocalToken(token);
  const [name, setName] = useState(displayName ?? '');
  const [saved, setSaved] = useState(false);

  const progress = useMemo(() => allProgrammeProgress(completedLessonIds), [completedLessonIds]);
  const certificates = progress.filter((item) => item.complete);
  const inProgress = progress.filter((item) => item.done > 0 && !item.complete);
  const achievements = deriveAchievements({
    completedCount: completedLessonIds.length,
    streak,
    level,
    certificates: certificates.length,
  });

  const saveName = (event: FormEvent) => {
    event.preventDefault();
    setDisplayName(name);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="min-h-dvh bg-primary-dark pb-24 text-white">
      <AppHeader home={signedIn ? '/learn/skill-tree' : '/'} />
      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-5">
        <section className="card flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/40 text-accent text-xl font-bold grid place-items-center shrink-0">
            {(displayName ?? email ?? t('profile')).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold">{displayName ?? t('guestProfileHint')}</h1>
            {email && <p className="text-xs text-muted mt-1">{email}</p>}
            <p className="text-xs text-accent mt-1">
              {signedIn ? (localSession ? t('sessionDevice') : t('sessionCloud')) : t('guestProfileHint')}
            </p>
            {signedIn && (
              <div className="mt-2">
                <StreakBadge streak={streak} />
              </div>
            )}
          </div>
        </section>

        <section className="card space-y-3">
          <h2 className="text-sm font-semibold text-muted">{t('language')}</h2>
          <p className="text-sm text-muted">{t('languageHint')}</p>
          <LanguagePicker />
        </section>

        {signedIn ? (
          <>
            <section className="card space-y-3">
              <h2 className="text-sm font-semibold text-muted">{t('manageAccount')}</h2>
              <form className="flex flex-col sm:flex-row gap-2" onSubmit={saveName}>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="flex-1 rounded-xl bg-primary-dark border border-surface-light px-3 py-2.5 text-sm"
                  aria-label={t('editName')}
                />
                <button type="submit" className="btn-secondary !py-2.5 text-sm">
                  {saved ? t('nameSaved') : t('saveName')}
                </button>
              </form>
              <XPBar totalXp={xp} />
              <div className="flex flex-wrap gap-4 text-sm">
                <p>
                  <span className="font-semibold">{xp.toLocaleString()}</span>{' '}
                  <span className="text-muted">{t('totalXp')}</span>
                </p>
                <p>
                  <span className="font-semibold">{longestStreak}</span>{' '}
                  <span className="text-muted">{t('longestStreak')}</span>
                </p>
                <p>
                  <span className="font-semibold">{completedLessonIds.length}</span>{' '}
                  <span className="text-muted">{t('lessons')}</span>
                </p>
              </div>
            </section>

            <section className="card space-y-3">
              <h2 className="text-sm font-semibold text-muted">
                {t('achievements')} · {achievements.filter((item) => item.earned).length}/{achievements.length}
              </h2>
              <p className="text-sm text-muted">{t('achievementsHint')}</p>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {achievements.map((item) => (
                  <li
                    key={item.id}
                    className={clsx(
                      'rounded-2xl border px-3 py-3 text-center',
                      item.earned ? 'border-accent/40 bg-accent/10' : 'border-surface-light opacity-50'
                    )}
                  >
                    <span className="text-2xl block">{item.icon}</span>
                    <span className="text-xs mt-2 block leading-snug">{t(item.id as StringKey)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card space-y-3">
              <h2 className="text-sm font-semibold text-muted">
                {t('certificates')} · {certificates.length}
              </h2>
              <p className="text-sm text-muted">{t('certificatesHint')}</p>
              {certificates.length === 0 && inProgress.length === 0 ? (
                <p className="text-sm text-muted">{t('noCertificates')}</p>
              ) : (
                <ul className="space-y-3">
                  {certificates.map((item) => (
                    <li key={item.path.id} className="rounded-2xl border border-success/30 bg-success/10 p-4">
                      <p className="text-xs uppercase tracking-wider text-success">{t('earned')}</p>
                      <h3 className="font-semibold mt-1">{item.path.title}</h3>
                      {item.path.certificationTarget && (
                        <p className="text-sm text-muted mt-1">{item.path.certificationTarget}</p>
                      )}
                      <p className="text-xs text-muted mt-2">
                        {item.done}/{item.total} {t('lessons')}
                      </p>
                    </li>
                  ))}
                  {inProgress.map((item) => (
                    <li key={item.path.id} className="rounded-2xl border border-surface-light p-4">
                      <p className="text-xs uppercase tracking-wider text-accent">{t('inProgress')}</p>
                      <h3 className="font-semibold mt-1">{item.path.title}</h3>
                      {item.path.certificationTarget && (
                        <p className="text-sm text-muted mt-1">{item.path.certificationTarget}</p>
                      )}
                      <div className="xp-bar mt-3">
                        <div className="xp-bar-fill" style={{ width: `${item.percent}%` }} />
                      </div>
                      <p className="text-xs text-muted mt-2">
                        {item.done}/{item.total} {t('lessons')} · {item.percent}%
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <Link to="/learn/skill-tree" className="btn-primary block text-center text-sm flex-1">
                  {t('chooseCourseTitle')}
                </Link>
                <button
                  type="button"
                  className="btn-secondary text-sm"
                  onClick={() => {
                    restartOnboarding();
                    navigate('/onboard');
                  }}
                >
                  {t('redoOnboarding')}
                </button>
              </div>
              {chosenPathIds.length > 0 && (
                <p className="text-xs text-muted">
                  {chosenPathIds.length} {t('myCourses')}
                </p>
              )}
            </section>

            <Link to="/curriculum" className="card block hover:border-accent/40">
              <p className="text-xs uppercase tracking-wider text-muted">{t('studioKicker')}</p>
              <p className="font-semibold mt-1">{t('studioTitle')}</p>
              <p className="text-sm text-muted mt-1">{t('studioHelp')}</p>
            </Link>

            <button className="btn-secondary w-full text-sm" onClick={() => reset()}>
              {t('logout')}
            </button>
          </>
        ) : (
          <section className="card space-y-3">
            <p className="text-sm text-muted">{t('guestProfileHint')}</p>
            <Link to="/login" className="btn-primary block text-center">
              {t('login')}
            </Link>
            <Link to="/study" className="btn-secondary block text-center">
              {t('studyBrowse')}
            </Link>
          </section>
        )}
      </main>
      {signedIn && <BottomNav />}
    </div>
  );
}
