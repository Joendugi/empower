import { clsx } from 'clsx';
import { CloudOff, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
  const isError = status === 'error';
  const isSyncing = pending > 0 || status === 'syncing';

  const message = offline
    ? t('offline')
    : isError
      ? t('syncError')
      : isSyncing
        ? t('syncing')
        : t('syncReady');

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'w-full px-4 py-1 text-xs font-medium flex items-center justify-center gap-2 border-b',
        offline
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          : isError
            ? 'bg-danger/10 text-danger border-danger/20'
            : isSyncing
              ? 'bg-accent/10 text-accent border-accent/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      )}
    >
      {offline ? (
        <CloudOff className="w-3.5 h-3.5 shrink-0" />
      ) : isError ? (
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
      ) : isSyncing ? (
        <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
      )}
      <span>{message}</span>
      {offline && pending > 0 ? (
        <span className="opacity-80 font-mono text-[11px] bg-amber-500/20 px-1.5 py-0.2 rounded">
          {pending} {t('willSync')}
        </span>
      ) : null}
    </div>
  );
}
