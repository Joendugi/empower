import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, KeyRound, Sparkles } from 'lucide-react';
import type { TokenResponse } from '@cyberlearn/types';
import { authenticate } from '@/lib/auth';
import { isEducator, isStaff } from '@/lib/localAccounts';
import { completePasswordReset, requestPasswordReset } from '@/lib/passwordReset';
import { phoneError, sanitizePhoneInput } from '@/lib/validate';
import type { NoticeChannel } from '@/lib/notify';
import { CLOUD_COOKIE_TOKEN } from '@/lib/tokenVault';
import { useLearnerStore } from '@/store/learnerStore';
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
  const wantsEducator = params.get('role') === 'educator' || (params.get('next') ?? '').includes('/educator');
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(wantsEducator && !storedEmail ? 'register' : 'login');
  const [email, setEmail] = useState(storedEmail ?? '');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetReady, setResetReady] = useState(false);
  const [accountType, setAccountType] = useState<'learner' | 'educator'>(wantsEducator ? 'educator' : 'learner');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!wantsEducator) return;
    setAccountType('educator');
    if (!storedEmail) setMode('register');
  }, [storedEmail, wantsEducator]);

  const finish = (body: TokenResponse, registered = false) => {
    applyAuth(body.accessToken || CLOUD_COOKIE_TOKEN, body.learner);
    const next = params.get('next');
    if (isStaff(body.learner.email)) {
      navigate(next?.startsWith('/') ? next : '/office');
      return;
    }
    if (isEducator(body.learner.email) || (registered && accountType === 'educator')) {
      useLearnerStore.getState().completeOnboarding({
        role: 'trainer',
        goal: 'community',
        track: 'all',
      });
      navigate(next?.startsWith('/educator') || next?.startsWith('/study') ? next : '/educator');
      return;
    }
    if (!useLearnerStore.getState().onboardingCompleted) {
      navigate('/onboard');
      return;
    }
    navigate(next?.startsWith('/') ? next : '/learn/skill-tree');
  };

  const sendReset = async (channel: NoticeChannel) => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await requestPasswordReset(email, channel);
      setResetReady(true);
      setInfo(
        result.via === 'cloud'
          ? 'The platform emailed a reset code. Check that inbox, then enter the code here.'
          : channel === 'email'
            ? 'Your email app opened with a 6-digit code. Send that message, then enter the code here.'
            : 'Your SMS app opened with a 6-digit code. Send that text, then enter the code here.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === 'register' && phone.trim()) {
        const invalidPhone = phoneError(phone);
        if (invalidPhone) {
          setError(invalidPhone);
          return;
        }
      }
      if (mode === 'reset') {
        await completePasswordReset(email, resetCode, password);
        setInfo('Password updated. Sign in with the new password.');
        setMode('login');
        setResetCode('');
        return;
      }
      const result = await authenticate({
        mode: mode === 'register' ? 'register' : 'login',
        email,
        password,
        displayName,
        preferredLanguage: language,
        accountType,
        phone,
      });
      finish(result, mode === 'register');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('signInFailed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh bg-primary-dark text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* African TVET School Workshop Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-35 pointer-events-none"
        style={{ backgroundImage: "url('/images/tvet-school-hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/85 to-primary-dark/70 pointer-events-none" />

      {/* Top Profile Icon */}
      <div className="absolute top-4 right-4 z-20">
        <ProfileButton />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <Link to="/" className="mb-6 flex justify-center group">
          <BrandMark size="lg" showText />
        </Link>

        {/* Auth Card */}
        <div className="card !p-7">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="badge-accent text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              TVET Learning Portal
            </span>
          </div>

          <h2 className="text-center text-xl font-bold text-white mb-1">
            {mode === 'reset' ? 'Reset password' : mode === 'login' ? t('signInTitle') : t('register')}
          </h2>
          <p className="text-center text-xs text-accent font-medium mb-4">
            {mode === 'reset'
              ? 'Free email or SMS — uses the app on this phone, no paid gateway'
              : accountType === 'educator' && mode === 'register'
                ? 'Educator application account'
                : t('signInSave')}
          </p>

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
                  className="w-full rounded-md bg-surface border border-white/[0.08] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent placeholder:text-muted"
                  placeholder={t('displayName')}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
                <input
                  className="w-full rounded-md bg-surface border border-white/[0.08] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent placeholder:text-muted"
                  placeholder="Phone 0712000000"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={16}
                  pattern="[0-9+]+"
                  title="Numbers only"
                  value={phone}
                  onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                />
              </>
            )}

            <div className="space-y-3">
              <input
                className="w-full rounded-md bg-surface border border-white/[0.08] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent placeholder:text-muted"
                placeholder={t('email')}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {mode === 'reset' && resetReady && (
                <input
                  className="w-full rounded-md bg-surface border border-white/[0.08] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent placeholder:text-muted"
                  placeholder="Code from email or SMS"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
              )}
              {mode !== 'reset' || resetReady ? (
                <input
                  className="w-full rounded-md bg-surface border border-white/[0.08] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent placeholder:text-muted"
                  placeholder={mode === 'reset' ? 'New password (8+ characters)' : t('password')}
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required={mode !== 'reset' || resetReady}
                />
              ) : null}
            </div>

            {info && (
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs">{info}</div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-danger/15 border border-danger/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {mode === 'reset' && !resetReady ? (
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="btn-primary py-3 text-sm" disabled={busy} onClick={() => void sendReset('email')}>
                  Email code
                </button>
                <button type="button" className="btn-secondary py-3 text-sm" disabled={busy} onClick={() => void sendReset('sms')}>
                  SMS code
                </button>
              </div>
            ) : (
              <button className="btn-primary w-full py-3 text-sm" disabled={busy}>
                {busy ? (
                  t('signingIn')
                ) : mode === 'reset' ? (
                  'Save new password'
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
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted pt-2">
              <Lock className="w-3 h-3 text-accent" />
              <span>{t('authSecurityNote')}</span>
            </div>

            <div className="pt-3 border-t border-white/[0.08] text-center text-xs text-muted space-y-2">
              {mode === 'login' && (
                <button type="button" className="text-accent hover:underline font-semibold block w-full" onClick={() => { setMode('reset'); setResetReady(false); setInfo(null); }}>
                  Forgot password?
                </button>
              )}
              {mode === 'reset' ? (
                <button
                  type="button"
                  className="text-accent hover:underline font-semibold"
                  onClick={() => { setMode('login'); setResetReady(false); setInfo(null); }}
                >
                  Back to sign in
                </button>
              ) : (
                <>
                  {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    className="text-accent hover:underline font-semibold"
                    onClick={() => {
                      setMode(mode === 'register' ? 'login' : 'register');
                      setResetReady(false);
                    }}
                  >
                    {mode === 'register' ? t('login') : t('createFree')}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
