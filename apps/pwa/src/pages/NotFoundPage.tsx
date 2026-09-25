import { Link } from 'react-router-dom';
import BrandMark from '@/components/ui/BrandMark';
import { useT } from '@/i18n';

export default function NotFoundPage() {
  const t = useT();
  return (
    <div className="min-h-dvh bg-primary-dark text-white grid place-items-center px-6">
      <div className="text-center max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <BrandMark size="sm" />
          <span className="font-semibold">{t('brand')}</span>
        </Link>
        <h1 className="text-2xl font-bold">{t('pageMissing')}</h1>
        <p className="text-sm text-muted mt-3">{t('pageMissingBody')}</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          {t('back')}
        </Link>
      </div>
    </div>
  );
}
