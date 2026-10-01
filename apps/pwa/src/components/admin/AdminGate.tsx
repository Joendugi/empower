import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '@/components/ui/BrandMark';
import { ensureOwnerAccount, isStaff } from '@/lib/localAccounts';
import { useLearnerStore } from '@/store/learnerStore';
import { useT } from '@/i18n';

export default function AdminGate({ children }: { children: ReactNode }) {
  const t = useT();
  const email = useLearnerStore((state) => state.email);
  const token = useLearnerStore((state) => state.token);
  const valid = useLearnerStore((state) => Boolean(state.token && !state.isGuest && state.isSessionValid()));

  useEffect(() => {
    void ensureOwnerAccount();
  }, []);

  if (valid && token && isStaff(email)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-dvh bg-primary-dark text-white grid place-items-center px-6">
      <div className="text-center max-w-md w-full">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <BrandMark size="sm" />
          <span className="font-semibold">{t('brand')}</span>
        </Link>
        <h1 className="text-2xl font-bold">Staff office</h1>
        <p className="text-sm text-muted mt-3">
          Sign in with the owner account or a limited staff account created by the owner. Learners cannot open
          this page.
        </p>
        <Link to="/login?next=/office" className="btn-primary mt-6 inline-flex">
          Sign in to continue
        </Link>
        <Link to="/" className="btn-secondary mt-6 inline-flex">
          {t('back')}
        </Link>
      </div>
    </div>
  );
}
