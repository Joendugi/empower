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
  LogOut, 
  Clock,
  BookOpen,
  Play,
  RotateCcw,
  RefreshCw,
  Layers,
  ArrowRight
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
import { scheduleCloudSync } from '@/lib/syncEngine';
import { useLearnerStore } from '@/store/learnerStore';
import { useSyncStore } from '@/store/syncStore';
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
  
  const syncStatus = useSyncStore((s) => s.status);
  const pendingSyncCount = useSyncStore((s) => s.pending);
  
  const signedIn = Boolean(token);
  const localSession = isLocalToken(token);
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'settings'>('overview');
  const [name, setName] = useState(displayName ?? '');
  const [saved, setSaved] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [viewCertPath, setViewCertPath] = useState<SkillPath | null>(null);

  const progress = useMemo(() => allProgrammeProgress(completedLessonIds), [completedLessonIds]);
  const certificates = progress.filter((item) => item.complete);
  const inProgress = progress.filter((item) => item.done > 0 && !item.complete);
  const primaryTrack = inProgress[0] ?? progress[0];

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

  const handleSignOut = () => {
    reset();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-primary-dark pb-28 text-white bg-grid-pattern">
      <AppHeader home={signedIn ? '/learn/skill-tree' : '/'} />
      
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* User Identity Header Card */}
        <section className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-white/[0.08] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent/20 to-surface-light border border-accent/40 text-accent text-2xl font-black grid place-items-center shrink-0 shadow-glow">
              {(displayName ?? email ?? t('profile')).slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white truncate">
                  {displayName ?? (signedIn ? 'Empower Learner' : t('guestProfileHint'))}
                </h1>
                {signedIn && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-bold">
                    Level {level}
                  </span>
                )}
              </div>
              {email && <p className="text-xs text-muted mt-0.5">{email}</p>}
              <div className="flex items-center gap-2 mt-2">
                <span className="badge-accent text-[10px]">
                  <ShieldCheck className="w-3 h-3" />
                  {signedIn ? (localSession ? t('sessionDevice') : t('sessionCloud')) : 'Guest Session'}
                </span>
                {signedIn && <StreakBadge streak={streak} />}
              </div>
            </div>
          </div>

          {signedIn && (
            <button
              type="button"
              onClick={handleSignOut}
              className="btn-secondary !py-2 !px-3.5 text-xs text-rose-300 hover:bg-danger/15 border-danger/30 flex items-center gap-1.5 shrink-0"
              title="Sign out and return to landing page"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </section>

        {signedIn ? (
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview & Learning', icon: BookOpen },
                { id: 'certificates', label: `Certificates (${certificates.length})`, icon: Award },
                { id: 'settings', label: 'Settings & Security', icon: Clock },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
                      active
                        ? 'bg-accent text-primary-dark shadow-glow'
                        : 'text-muted hover:text-white hover:bg-surface-light/60'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW & LEARNING */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Active Learning Fast-Resume Banner */}
                {primaryTrack && primaryTrack.nextLessonId && (
                  <div className="card !p-5 border-accent/40 bg-gradient-to-r from-accent/[0.12] via-surface to-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 text-accent flex items-center justify-center shrink-0">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Active Course</span>
                        <h2 className="font-bold text-base text-white">{primaryTrack.path.title}</h2>
                        <p className="text-xs text-muted mt-0.5">
                          {primaryTrack.done} of {primaryTrack.total} lessons complete ({primaryTrack.percent}%)
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/learn/lesson/${primaryTrack.nextLessonId}`}
                      className="btn-primary !py-2.5 !px-5 text-xs font-bold shadow-glow shrink-0 flex items-center gap-1.5"
                    >
                      <span>Continue Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Overall Stats Cards */}
                <section className="card space-y-4 border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Competency & XP Progress</h2>
                    <span className="text-xs font-mono text-accent">Level {level}</span>
                  </div>

                  <XPBar totalXp={xp} />

                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/[0.06] text-center">
                    <div className="p-3 rounded-xl bg-surface-light/40 border border-white/[0.04]">
                      <span className="font-black text-lg text-white">{xp.toLocaleString()}</span>
                      <span className="block text-[10px] text-muted uppercase mt-0.5">{t('totalXp')}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-light/40 border border-white/[0.04]">
                      <span className="font-black text-lg text-orange-400">{longestStreak}d</span>
                      <span className="block text-[10px] text-muted uppercase mt-0.5">{t('longestStreak')}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-light/40 border border-white/[0.04]">
                      <span className="font-black text-lg text-accent">{completedLessonIds.length}</span>
                      <span className="block text-[10px] text-muted uppercase mt-0.5">{t('lessons')} Done</span>
                    </div>
                  </div>
                </section>

                {/* Enrolled Programmes List */}
                <section className="card space-y-4 border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-accent" />
                      Enrolled TVET Tracks ({progress.filter((p) => p.done > 0).length})
                    </h2>
                    <Link to="/learn/skill-tree" className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold">
                      Browse All Tracks <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {progress.filter((p) => p.done > 0).length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted mb-3">You haven't started any trade courses yet.</p>
                      <Link to="/learn/skill-tree" className="btn-primary !py-2 !px-4 text-xs font-semibold inline-flex">
                        Explore Curriculum
                      </Link>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {progress.filter((p) => p.done > 0).map((item) => (
                        <li key={item.path.id} className="p-4 rounded-xl border border-white/[0.08] bg-surface-light/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold uppercase text-accent">{item.path.track}</span>
                              <h3 className="font-bold text-sm text-white">{item.path.title}</h3>
                            </div>
                            <span className="text-xs font-mono font-bold text-white">{item.percent}%</span>
                          </div>
                          
                          <div className="xp-bar !h-1.5">
                            <div className="xp-bar-fill" style={{ width: `${item.percent}%` }} />
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-muted">
                              {item.done} / {item.total} lessons completed
                            </span>
                            <Link 
                              to={`/learn/course/${item.path.id}`}
                              className="text-xs text-accent hover:underline font-semibold flex items-center gap-1"
                            >
                              Roadmap <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
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
              </div>
            )}

            {/* TAB 2: CERTIFICATES & CREDENTIALS */}
            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <section className="card space-y-4 border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-accent" />
                        TVET Certificates of Competency
                      </h2>
                      <p className="text-xs text-muted mt-0.5">
                        Verifiable technical credentials with cryptographic QR validation and printable PDF output.
                      </p>
                    </div>
                    <span className="badge-accent text-xs font-bold">{certificates.length} Issued</span>
                  </div>

                  {certificates.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-white/[0.1] rounded-2xl p-6">
                      <Award className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
                      <h3 className="font-bold text-sm text-white">No Certificates Completed Yet</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-4">
                        Complete all modules and practical assessments in a course track to generate your official certificate.
                      </p>
                      <Link to="/learn/skill-tree" className="btn-primary !py-2 !px-4 text-xs font-bold inline-flex">
                        Explore Courses
                      </Link>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {certificates.map((item) => (
                        <li
                          key={item.path.id}
                          className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_15px_rgba(46,213,115,0.1)]"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Competency Verified</span>
                            </div>
                            <h3 className="font-bold text-base text-white mt-1">{item.path.title}</h3>
                            {item.path.certificationTarget && (
                              <p className="text-xs text-muted-light mt-0.5">{item.path.certificationTarget}</p>
                            )}
                            <p className="text-xs text-muted mt-1">
                              All {item.total} learning units completed
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setViewCertPath(item.path)}
                            className="btn-primary !py-2.5 !px-5 text-xs shrink-0 flex items-center gap-2 font-bold shadow-glow"
                          >
                            <QrCode className="w-4 h-4" /> View & Print Certificate
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* In Progress Certification Targets */}
                {inProgress.length > 0 && (
                  <section className="card space-y-4 border-white/[0.08]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                      Qualifications In Progress ({inProgress.length})
                    </h3>
                    <ul className="space-y-3">
                      {inProgress.map((item) => (
                        <li key={item.path.id} className="rounded-xl border border-white/[0.08] bg-surface-light/30 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-accent">{item.path.title}</span>
                            <span className="text-xs font-mono text-muted">{item.percent}% complete</span>
                          </div>
                          <div className="xp-bar mt-2.5">
                            <div className="xp-bar-fill" style={{ width: `${item.percent}%` }} />
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs">
                            <span className="text-muted">{item.total - item.done} lessons remaining</span>
                            <Link to={`/learn/course/${item.path.id}`} className="text-accent hover:underline font-semibold">
                              Continue Track
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {/* TAB 3: SETTINGS & SECURITY */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Account Profile Name */}
                <section className="card space-y-3 border-white/[0.08]">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted">{t('manageAccount')}</h2>
                  <form className="flex flex-col sm:flex-row gap-2" onSubmit={saveName}>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="flex-1 rounded-xl bg-surface/90 border border-white/[0.08] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent/60 placeholder:text-muted"
                      placeholder="Your full learner name"
                      aria-label={t('editName')}
                    />
                    <button type="submit" className="btn-secondary !py-2.5 text-xs font-semibold">
                      {saved ? t('nameSaved') : t('saveName')}
                    </button>
                  </form>
                  <p className="text-[11px] text-muted">
                    This name will appear on all your generated TVET certificates of competency.
                  </p>
                </section>

                {/* Preference Toggles (Language, Audio, Auto-Logout) */}
                <div className="grid sm:grid-cols-3 gap-4">
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
                        <span>{soundOn ? 'Active' : 'Muted'}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase font-bold">{soundOn ? 'ON' : 'OFF'}</span>
                    </button>
                  </section>

                  <section className="card space-y-3 border-white/[0.08] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Auto-Logout</h2>
                        <span className="badge-accent text-[9px] font-mono font-bold">15 MIN</span>
                      </div>
                      <p className="text-xs text-muted mt-1">Automatic logout to landing page after 15 minutes of inactivity.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-accent font-medium bg-accent/10 border border-accent/20 px-2.5 py-1.5 rounded-xl">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Protects shared devices</span>
                    </div>
                  </section>
                </div>

                {/* Device & Sync Ledger Health */}
                <section className="card space-y-3 border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Offline Replica & Cloud Sync</h2>
                      <p className="text-xs text-muted mt-0.5">
                        Status: <span className="font-bold text-white capitalize">{syncStatus}</span>
                        {pendingSyncCount > 0 && ` (${pendingSyncCount} events in local offline queue)`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => scheduleCloudSync()}
                      className="btn-secondary !py-2 !px-3 text-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync Now</span>
                    </button>
                  </div>
                </section>

                {/* Onboarding Restart */}
                <section className="card flex items-center justify-between p-4 border-white/[0.08]">
                  <div>
                    <h3 className="font-bold text-sm text-white">Reset Course Onboarding</h3>
                    <p className="text-xs text-muted">Re-select your trade goals and primary learning tracks.</p>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary !py-2 !px-3.5 text-xs flex items-center gap-1.5 shrink-0"
                    onClick={() => {
                      restartOnboarding();
                      navigate('/onboard');
                    }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Redo Onboarding</span>
                  </button>
                </section>

                {/* Curriculum Studio Link */}
                <Link to="/curriculum" className="card-interactive block !p-5 border-white/[0.08]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{t('studioKicker')}</p>
                  <p className="font-bold text-base text-white mt-1">{t('studioTitle')}</p>
                  <p className="text-xs text-muted mt-1">{t('studioHelp')}</p>
                </Link>

                {/* Dedicated Sign Out to Landing Page Button */}
                <button 
                  type="button"
                  className="btn-secondary w-full text-xs py-3.5 border-danger/40 text-rose-300 hover:bg-danger/15 flex items-center justify-center gap-2 font-bold transition-all" 
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out to Landing Page</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <section className="card space-y-4 border-white/[0.08] !p-8 text-center max-w-md mx-auto">
            <h2 className="text-lg font-bold text-white">Sign In to Your Learning Account</h2>
            <p className="text-xs text-muted leading-relaxed">
              Create a free account or sign in to track your XP, earn accredited TVET certificates, and sync across workshop devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/login" className="btn-primary py-2.5 text-xs flex-1 font-bold">
                {t('login')}
              </Link>
              <Link to="/" className="btn-secondary py-2.5 text-xs flex-1">
                Return to Landing Page
              </Link>
            </div>
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
