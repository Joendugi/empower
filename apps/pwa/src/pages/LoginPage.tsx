import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Lock, KeyRound, Sparkles } from 'lucide-react';
import type { TokenResponse } from '@cyberlearn/types';
import { authenticate, probeApiHealth } from '@/lib/auth';
import { CLOUD_COOKIE_TOKEN } from '@/lib/tokenVault';
import { useLearnerStore } from '@/store/learnerStore';
import { usePlatformStore } from '@/store/platformStore';
import { useT } from '@/i18n';
import ProfileButton from '@/components/ui/ProfileButton';
import BrandMark from '@/components/ui/BrandMark';

export default function LoginPage() {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const applyAuth = useLearnerStore((s) => s.applyAuth);
  const language = useLearnerStore((s) => s.language);
  const storedEmail = useLearnerStore((s) => s.email);
  const deploymentMode = usePlatformStore((s) => s.deploymentMode);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState(storedEmail ?? '');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [accountType, setAccountType] = useState<'learner' | 'educator'>('learner');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cloudUp, setCloudUp] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    void probeApiHealth().then((up) => {
      if (!cancelled) setCloudUp(up);
    });
    return () => {
      cancelled = true;
    };
  }, [deploymentMode]);

  const finish = (body: TokenResponse, registered = false) => {
    applyAuth(body.accessToken || CLOUD_COOKIE_TOKEN, body.learner);
    const next = params.get('next');
    if (registered && accountType === 'educator') {
      useLearnerStore.getState().completeOnboarding({
        role: 'trainer',
        goal: 'community',
        track: 'all',
      });
      navigate('/educator');
      return;
    }
    if (!useLearnerStore.getState().onboardingCompleted) {
      navigate('/onboard');
      return;
    }
    navigate(next?.startsWith('/') ? next : '/learn/skill-tree');
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await authenticate({
        mode,
        email,
        password,
        displayName,
        preferredLanguage: language,
        accountType,
      });
      finish(result, mode === 'register');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('signInFailed'));
    } finally {
      setBusy(false);
    }
  };

  const statusLabel =
    deploymentMode === 'offline'
      ? t('authStatusOffline')
      : cloudUp
        ? t('authStatusCloud')
        : cloudUp === false
          ? t('authStatusLocal')
          : t('authStatusChecking');

  return (
    <div className="min-h-dvh bg-primary-dark text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-grid-pattern">
      {/* African TVET School Workshop Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity scale-105 pointer-events-none"
        style={{ backgroundImage: "url('/images/tvet-school-hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/90 to-primary-dark/80 pointer-events-none" />

      {/* Top Profile Icon */}
      <div className="absolute top-4 right-4 z-20">
        <ProfileButton />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <Link to="/" className="mb-6 text-center flex flex-col items-center group">
          <BrandMark size="lg" />
          <span className="text-2xl font-extrabold text-white mt-3 tracking-tight group-hover:text-accent transition-colors">
            {t('brand')}
          </span>
          <span className="text-xs uppercase font-mono tracking-wider text-muted mt-0.5">
            {t('institution')}
          </span>
        </Link>

        {/* Security Feature Badge */}
        <div className="card !p-7 border-white/[0.12] shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="badge-accent text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Protected Resource Access
            </span>
          </div>

          <h2 className="text-center text-xl font-bold text-white mb-1">
            {mode === 'login' ? t('signInTitle') : 'Create Protected Account'}
          </h2>
          <p className="text-center text-xs text-accent font-medium mb-4">{statusLabel}</p>

          {storedEmail && params.get('next') ? (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center mb-4">
              {t('sessionExpired')}
            </div>
          ) : (
            <p className="text-center text-xs text-muted mb-4 leading-relaxed">{t('authLocalHelp')}</p>
          )}

          <form className="space-y-3.5" onSubmit={(e) => void onSubmit(e)}>
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-2" aria-label="Account type">
                  <button
                    type="button"
                    className={accountType === 'learner' ? 'btn-primary !py-2 !px-3 text-xs' : 'btn-secondary !py-2 !px-3 text-xs'}
                    onClick={() => setAccountType('learner')}
                  >
                    Learner Account
                  </button>
                  <button
                    type="button"
                    className={accountType === 'educator' ? 'btn-primary !py-2 !px-3 text-xs' : 'btn-secondary !py-2 !px-3 text-xs'}
                    onClick={() => setAccountType('educator')}
                  >
                    Educator Account
                  </button>
                </div>
                <p className="text-[11px] text-muted leading-tight">
                  Educator accounts submit credentials for admin review before publishing curriculum.
                </p>
                <input
                  className="w-full rounded-xl bg-surface/90 border border-white/[0.08] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent/60 placeholder:text-muted"
                  placeholder={t('displayName')}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </>
            )}

            <div className="space-y-3">
              <input
                className="w-full rounded-xl bg-surface/90 border border-white/[0.08] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent/60 placeholder:text-muted"
                placeholder={t('email')}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="w-full rounded-xl bg-surface/90 border border-white/[0.08] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent/60 placeholder:text-muted"
                placeholder={t('password')}
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-danger/15 border border-danger/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <button className="btn-primary w-full py-3 text-sm" disabled={busy}>
              {busy ? (
                t('signingIn')
              ) : mode === 'login' ? (
                <>
                  <KeyRound className="w-4 h-4" /> {t('login')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> {t('register')}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted pt-2">
              <Lock className="w-3 h-3 text-accent" />
              <span>{t('authSecurityNote')}</span>
            </div>

            <div className="pt-3 border-t border-white/[0.08] text-center text-xs text-muted">
              {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
              <button
                type="button"
                className="text-accent hover:underline font-semibold"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? t('createFree') : t('login')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
