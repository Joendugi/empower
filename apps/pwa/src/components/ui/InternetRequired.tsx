import BrandMark from '@/components/ui/BrandMark';
import { useT } from '@/i18n';
import type { InternetProbeReason } from '@/lib/internet';

export default function InternetRequired({
  checking,
  reason,
  onRetry,
}: {
  checking?: boolean;
  reason?: InternetProbeReason | null;
  onRetry: () => void;
}) {
  const t = useT();
  const detail =
    reason === 'timeout'
      ? t('internetReasonTimeout')
      : reason === 'unreachable'
        ? t('internetReasonUnreachable')
        : reason === 'offline'
          ? t('internetReasonOffline')
          : null;

  return (
    <div className="min-h-dvh bg-primary-dark text-white grid place-items-center px-6">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="flex justify-center">
          <BrandMark size="lg" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t('brand')}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-balance">
          {checking ? t('internetChecking') : t('internetRequiredTitle')}
        </h1>
        <p className="text-muted leading-relaxed">
          {checking ? t('internetCheckingBody') : t('internetRequiredBody')}
        </p>
        {!checking && detail ? <p className="text-sm text-amber-200">{detail}</p> : null}
        {!checking && (
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={onRetry}>
            {t('internetRetry')}
          </button>
        )}
        {checking && (
          <div
            className="mx-auto w-10 h-10 rounded-full border-[3px] border-surface-light border-t-accent animate-spin"
            role="status"
            aria-label={t('internetChecking')}
          />
        )}
      </div>
    </div>
  );
}
