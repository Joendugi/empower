import { useOfflineSync } from '@/hooks/useOfflineSync';
import { clsx } from 'clsx';
import { useT } from '@/i18n';

export default function OfflineBanner({ forceOffline = false }: { forceOffline?: boolean }) {
  const { isOnline, queueLength, hasPendingSync } = useOfflineSync();
  const t = useT();
  const offline = forceOffline || !isOnline;

  if (!offline && !hasPendingSync) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'w-full px-4 py-2 text-sm font-medium text-center transition-all duration-300',
        offline
          ? 'bg-warning/20 text-warning border-b border-warning/30'
          : 'bg-accent/20 text-accent border-b border-accent/30'
      )}
    >
      {offline ? (
        <span>
          {t('reconnectBanner')}
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
