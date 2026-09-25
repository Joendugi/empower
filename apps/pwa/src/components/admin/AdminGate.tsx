import { FormEvent, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '@/components/ui/BrandMark';
import { hasAdminGrant, tryStaffUnlock } from '@/lib/adminAccess';
import { isLocalAdmin, promoteLocalAdmin } from '@/lib/localAccounts';
import { useLearnerStore } from '@/store/learnerStore';
import { useT } from '@/i18n';

export default function AdminGate({ children }: { children: ReactNode }) {
  const t = useT();
  const email = useLearnerStore((state) => state.email);
  const token = useLearnerStore((state) => state.token);
  const valid = useLearnerStore((state) => Boolean(state.token && !state.isGuest && state.isSessionValid()));
  const [granted, setGranted] = useState(() => hasAdminGrant(email) && Boolean(email && isLocalAdmin(email)));
  const [passphrase, setPassphrase] = useState('');
  const [status, setStatus] = useState('');

  const unlock = async (event: FormEvent) => {
    event.preventDefault();
    if (!valid || !email) {
      setStatus(t('pageMissingBody'));
      return;
    }
    const result = await tryStaffUnlock(passphrase, email);
    if (result === 'ok') {
      promoteLocalAdmin(email);
      setGranted(true);
      setPassphrase('');
      setStatus('');
      return;
    }
    setStatus(result === 'locked' ? t('pageMissingBody') : t('pageMissingBody'));
    setPassphrase('');
  };

  if (granted && hasAdminGrant(email)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-dvh bg-primary-dark text-white grid place-items-center px-6">
      <div className="text-center max-w-md w-full">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <BrandMark size="sm" />
          <span className="font-semibold">{t('brand')}</span>
        </Link>
        <h1 className="text-2xl font-bold">{t('pageMissing')}</h1>
        <p className="text-sm text-muted mt-3">{t('pageMissingBody')}</p>
        {valid && token && (
          <form className="mt-8" onSubmit={(event) => void unlock(event)}>
            <label className="sr-only" htmlFor="office-ref">
              Reference
            </label>
            <input
              id="office-ref"
              type="password"
              autoComplete="off"
              className="w-full bg-transparent border-0 border-b border-surface-light/40 text-white/40 text-sm px-0 py-2 focus:outline-none focus:border-white/20"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
            />
            <button type="submit" className="sr-only">
              Continue
            </button>
          </form>
        )}
        {status && <p className="text-xs text-muted mt-4">{status}</p>}
        <Link to="/" className="btn-secondary mt-6 inline-flex">
          {t('back')}
        </Link>
      </div>
    </div>
  );
}
