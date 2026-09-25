import { useOfflineSync } from '@/hooks/useOfflineSync';
import { clsx } from 'clsx';
import { useT } from '@/i18n';

export default function OfflineBanner() {
  const { isOnline, queueLength, hasPendingSync } = useOfflineSync();
  const t = useT();

  if (isOnline && !hasPendingSync) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'w-full px-4 py-2 text-sm font-medium text-center transition-all duration-300',
        !isOnline
          ? 'bg-warning/20 text-warning border-b border-warning/30'
          : 'bg-accent/20 text-accent border-b border-accent/30'
      )}
    >
      {!isOnline ? (
        <span>
          {t('offline')}
          {queueLength > 0 && (
            <span className="ml-1 opacity-75">
              ({queueLength} {t('willSync')})
            </span>
          )}
        </span>
      ) : (
        <span>{t('syncing')}</span>
      )}
    </div>
  );
}
