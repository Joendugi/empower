import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  Award, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  QrCode,
  LogOut
} from 'lucide-react';
import AppHeader from '@/components/ui/AppHeader';
import BottomNav from '@/components/ui/BottomNav';
import LanguagePicker from '@/components/ui/LanguagePicker';
import StreakBadge from '@/components/gamification/StreakBadge';
import XPBar from '@/components/gamification/XPBar';
import CertificateModal from '@/components/certificates/CertificateModal';
import { allProgrammeProgress, deriveAchievements } from '@/lib/progress';
import { isLocalToken } from '@/lib/localApi';
import { isSoundEnabled, setSoundEnabled, playSuccessChime } from '@/lib/soundEffects';
import { useLearnerStore } from '@/store/learnerStore';
import { useT } from '@/i18n';
import type { StringKey } from '@/i18n/strings';
import type { SkillPath } from '@cyberlearn/types';

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
    reset,
    setDisplayName,
    restartOnboarding,
  } = useLearnerStore();
  const signedIn = Boolean(token);
  const localSession = isLocalToken(token);
  const [name, setName] = useState(displayName ?? '');
  const [saved, setSaved] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [viewCertPath, setViewCertPath] = useState<SkillPath | null>(null);

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

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playSuccessChime();
  };

  return (
    <div className="min-h-dvh bg-primary-dark pb-28 text-white bg-grid-pattern">
      <AppHeader home={signedIn ? '/learn/skill-tree' : '/'} />
      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        {/* User Avatar & Session Details */}
        <section className="card flex items-start gap-4 border-white/[0.08]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent/20 to-surface-light border border-accent/40 text-accent text-2xl font-black grid place-items-center shrink-0 shadow-glow">
            {(displayName ?? email ?? t('profile')).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold">{displayName ?? t('guestProfileHint')}</h1>
            {email && <p className="text-xs text-muted mt-0.5">{email}</p>}
            <div className="flex items-center gap-2 mt-2">
              <span className="badge-accent text-[10px]">
                <ShieldCheck className="w-3 h-3" />
                {signedIn ? (localSession ? t('sessionDevice') : t('sessionCloud')) : t('guestProfileHint')}
              </span>
              {signedIn && <StreakBadge streak={streak} />}
            </div>
          </div>
        </section>

        {/* Settings: Language & Sound Effects */}
        <div className="grid sm:grid-cols-2 gap-4">
          <section className="card space-y-3 border-white/[0.08]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">{t('language')}</h2>
            <LanguagePicker />
          </section>

          <section className="card space-y-3 border-white/[0.08] flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Audio & Haptics</h2>
              <p className="text-xs text-muted mt-1">Tactile audio feedback and completion chimes.</p>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={clsx(
                'inline-flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all',
                soundOn
                  ? 'bg-accent/15 border-accent/30 text-accent shadow-[0_0_12px_rgba(0,212,170,0.15)]'
                  : 'bg-surface-light border-white/[0.08] text-muted'
              )}
            >
              <div className="flex items-center gap-2">
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundOn ? 'Sound Effects Active' : 'Sound Muted'}</span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold">{soundOn ? 'ON' : 'OFF'}</span>
            </button>
          </section>
        </div>

        {signedIn ? (
          <>
            {/* Account Profile & XP Progress */}
            <section className="card space-y-4 border-white/[0.08]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">{t('manageAccount')}</h2>
              <form className="flex flex-col sm:flex-row gap-2" onSubmit={saveName}>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="flex-1 rounded-xl bg-surface/90 border border-white/[0.08] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent/60"
                  aria-label={t('editName')}
                />
                <button type="submit" className="btn-secondary !py-2.5 text-xs font-semibold">
                  {saved ? t('nameSaved') : t('saveName')}
                </button>
              </form>

              <XPBar totalXp={xp} />

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center">
                <div className="p-2.5 rounded-xl bg-surface-light/40">
                  <span className="font-black text-base text-white">{xp.toLocaleString()}</span>
                  <span className="block text-[10px] text-muted uppercase mt-0.5">{t('totalXp')}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-light/40">
                  <span className="font-black text-base text-orange-400">{longestStreak}d</span>
                  <span className="block text-[10px] text-muted uppercase mt-0.5">{t('longestStreak')}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-light/40">
                  <span className="font-black text-base text-accent">{completedLessonIds.length}</span>
                  <span className="block text-[10px] text-muted uppercase mt-0.5">{t('lessons')}</span>
                </div>
              </div>
            </section>

            {/* Achievements Showcase */}
            <section className="card space-y-4 border-white/[0.08]">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent" />
                  {t('achievements')}
                </h2>
                <span className="badge-accent text-[10px]">
                  {achievements.filter((item) => item.earned).length}/{achievements.length} Unlocked
                </span>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {achievements.map((item) => (
                  <li
                    key={item.id}
                    className={clsx(
                      'rounded-2xl border p-3.5 text-center transition-all',
                      item.earned
                        ? 'border-accent/40 bg-accent/10 shadow-[0_0_15px_rgba(0,212,170,0.1)]'
                        : 'border-white/[0.05] bg-surface-light/20 opacity-40'
                    )}
                  >
                    <span className="text-2xl block mb-1.5">{item.icon}</span>
                    <span className="text-xs font-semibold block leading-tight">{t(item.id as StringKey)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Verified TVET Certificates & Qualifications */}
            <section className="card space-y-4 border-white/[0.08]">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-accent" />
                  {t('certificates')} · {certificates.length}
                </h2>
                <span className="text-xs text-muted">{certificates.length} Completed Credentials</span>
              </div>

              {certificates.length === 0 && inProgress.length === 0 ? (
                <p className="text-xs text-muted py-2">{t('noCertificates')}</p>
              ) : (
                <ul className="space-y-3">
                  {certificates.map((item) => (
                    <li
                      key={item.path.id}
                      className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_15px_rgba(46,213,115,0.1)]"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('earned')}</span>
                        </div>
                        <h3 className="font-bold text-base text-white mt-1">{item.path.title}</h3>
                        {item.path.certificationTarget && (
                          <p className="text-xs text-muted-light mt-0.5">{item.path.certificationTarget}</p>
                        )}
                        <p className="text-xs text-muted mt-1">
                          {item.done}/{item.total} {t('lessons')} completed
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setViewCertPath(item.path)}
                        className="btn-primary !py-2 !px-4 text-xs shrink-0 flex items-center gap-1.5 font-bold"
                      >
                        <QrCode className="w-3.5 h-3.5" /> View Certificate
                      </button>
                    </li>
                  ))}

                  {inProgress.map((item) => (
                    <li key={item.path.id} className="rounded-2xl border border-white/[0.08] bg-surface-light/40 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase font-bold text-accent">{t('inProgress')}</p>
                        <span className="text-xs font-mono text-muted">{item.percent}%</span>
                      </div>
                      <h3 className="font-bold text-base text-white mt-1">{item.path.title}</h3>
                      {item.path.certificationTarget && (
                        <p className="text-xs text-muted mt-0.5">{item.path.certificationTarget}</p>
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

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Link to="/learn/skill-tree" className="btn-primary text-center text-xs py-2.5 flex-1">
                  {t('chooseCourseTitle')}
                </Link>
                <button
                  type="button"
                  className="btn-secondary text-xs py-2.5"
                  onClick={() => {
                    restartOnboarding();
                    navigate('/onboard');
                  }}
                >
                  {t('redoOnboarding')}
                </button>
              </div>
            </section>

            {/* Curriculum Studio link */}
            <Link to="/curriculum" className="card-interactive block !p-5 border-white/[0.08]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{t('studioKicker')}</p>
              <p className="font-bold text-base text-white mt-1">{t('studioTitle')}</p>
              <p className="text-xs text-muted mt-1">{t('studioHelp')}</p>
            </Link>

            {/* Logout Action */}
            <button 
              className="btn-secondary w-full text-xs py-3 border-danger/30 text-rose-300 hover:bg-danger/15 flex items-center justify-center gap-2" 
              onClick={() => reset()}
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </>
        ) : (
          <section className="card space-y-4 border-white/[0.08] !p-8 text-center">
            <p className="text-sm text-muted">{t('guestProfileHint')}</p>
            <Link to="/login" className="btn-primary w-full py-3 text-xs">
              {t('login')}
            </Link>
          </section>
        )}
      </main>

      {/* Certificate Viewer & PDF Generator Modal */}
      {viewCertPath && (
        <CertificateModal
          isOpen={Boolean(viewCertPath)}
          onClose={() => setViewCertPath(null)}
          learnerName={displayName || 'Learner'}
          path={viewCertPath}
        />
      )}

      {signedIn && <BottomNav />}
    </div>
  );
}
