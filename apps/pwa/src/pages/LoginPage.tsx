import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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

  const browserOnline = typeof navigator === 'undefined' ? true : navigator.onLine;
  const statusLabel =
    deploymentMode === 'offline'
      ? t('authStatusOffline')
      : cloudUp
        ? t('authStatusCloud')
        : cloudUp === false
          ? browserOnline
            ? t('authStatusCloudDown')
            : t('authStatusLocal')
          : t('authStatusChecking');

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,170,0.16),transparent_45%)]" />
      <div className="absolute top-4 right-4 z-10">
        <ProfileButton />
      </div>
      <Link to="/" className="relative z-10 mb-8 text-center inline-flex flex-col items-center animate-rise-in">
        <BrandMark size="lg" />
        <span className="font-display text-3xl font-extrabold tracking-tight text-white mt-4">{t('brand')}</span>
        <span className="text-xs text-muted mt-1">{t('institution')}</span>
      </Link>

      <form
        className="relative z-10 w-full max-w-sm space-y-3 rounded-3xl border border-surface-light/70 bg-surface/60 p-5 shadow-glow backdrop-blur-md animate-rise-in-delay"
        onSubmit={(e) => void onSubmit(e)}
      >
        <h2 className="font-display text-center text-xl font-bold text-white mb-1">{t('signInTitle')}</h2>
        <p className="text-center text-xs text-accent">{statusLabel}</p>
        {storedEmail && params.get('next') ? (
          <p className="text-center text-xs text-warning">{t('sessionExpired')}</p>
        ) : (
          <p className="text-center text-xs text-muted">{t('authLocalHelp')}</p>
        )}
        {mode === 'register' && (
          <>
            <div className="grid grid-cols-2 gap-2" aria-label="Account type">
              <button
                type="button"
                className={accountType === 'learner' ? 'btn-primary !px-3' : 'btn-secondary !px-3'}
                onClick={() => setAccountType('learner')}
              >
                Learner
              </button>
              <button
                type="button"
                className={accountType === 'educator' ? 'btn-primary !px-3' : 'btn-secondary !px-3'}
                onClick={() => setAccountType('educator')}
              >
                Educator
              </button>
            </div>
            <p className="text-xs text-muted">
              Educator accounts submit credentials for admin approval before proposing curriculum.
            </p>
            <input
              className="w-full rounded-xl bg-surface border border-surface-light px-3 py-3 text-white"
              placeholder={t('displayName')}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </>
        )}
        <input
          className="w-full rounded-xl bg-surface border border-surface-light px-3 py-3 text-white"
          placeholder={t('email')}
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded-xl bg-surface border border-surface-light px-3 py-3 text-white"
          placeholder={t('password')}
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? t('signingIn') : mode === 'login' ? t('login') : t('register')}
        </button>
        <p className="text-center text-xs text-muted pt-2">{t('authSecurityNote')}</p>
        <p className="text-center text-xs text-muted">
          {t('noAccount')}{' '}
          <button
            type="button"
            className="text-accent underline"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? t('createFree') : t('login')}
          </button>
        </p>
      </form>
    </div>
  );
}
