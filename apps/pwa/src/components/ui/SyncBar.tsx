import { clsx } from 'clsx';
import { useT } from '@/i18n';
import { useSyncStore } from '@/store/syncStore';

export default function SyncBar() {
  const t = useT();
  const status = useSyncStore((state) => state.status);
  const pending = useSyncStore((state) => state.pending);

  if (status === 'idle' || status === 'synced') {
    if (pending === 0) return null;
  }

  const offline = status === 'offline';
  const message = offline
    ? t('offline')
    : status === 'error'
      ? t('syncError')
      : pending > 0 || status === 'syncing'
        ? t('syncing')
        : t('syncReady');

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'w-full px-4 py-1.5 text-xs font-medium text-center transition-all duration-300',
        offline
          ? 'bg-warning/20 text-warning border-b border-warning/30'
          : status === 'error'
            ? 'bg-danger/15 text-danger border-b border-danger/20'
            : 'bg-accent/15 text-accent border-b border-accent/20'
      )}
    >
      {message}
      {offline && pending > 0 ? <span className="ml-1 opacity-75">({pending} {t('willSync')})</span> : null}
    </div>
  );
}
