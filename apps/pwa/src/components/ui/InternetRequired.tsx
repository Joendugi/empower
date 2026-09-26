import BrandMark from '@/components/ui/BrandMark';
import { useT } from '@/i18n';

export default function InternetRequired({
  checking,
  onRetry,
}: {
  checking?: boolean;
  onRetry: () => void;
}) {
  const t = useT();

  return (
    <div className="min-h-dvh bg-primary-dark text-white grid place-items-center px-6">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="flex justify-center">
          <BrandMark size="lg" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t('brand')}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-balance">{t('internetRequiredTitle')}</h1>
        <p className="text-muted leading-relaxed">{t('internetRequiredBody')}</p>
        <button
          type="button"
          className="btn-primary w-full sm:w-auto"
          onClick={onRetry}
          disabled={checking}
        >
          {checking ? t('internetChecking') : t('internetRetry')}
        </button>
      </div>
    </div>
  );
}
