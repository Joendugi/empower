import { CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useT } from '@/i18n';
import { useSyncStore } from '@/store/syncStore';
import { runCloudSync } from '@/lib/syncEngine';

export default function SyncBar() {
  const t = useT();
  const status = useSyncStore((state) => state.status);
  const pending = useSyncStore((state) => state.pending);

  if (status !== 'offline' && pending === 0 && status !== 'syncing') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full px-4 py-1.5 text-xs font-medium flex items-center justify-between border-b bg-amber-500/10 text-amber-300 border-amber-500/20"
    >
      <div className="flex items-center gap-2">
        {status === 'offline' ? (
          <CloudOff className="w-3.5 h-3.5 shrink-0 text-amber-400" />
        ) : status === 'syncing' ? (
          <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin text-emerald-400" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
        )}
        <span>
          {status === 'offline'
            ? `${t('offline')} · ${pending} ${pending === 1 ? 'item' : 'items'} queued for sync`
            : status === 'syncing'
            ? 'Syncing offline progress to cloud...'
            : `${pending} changes saved locally`}
        </span>
      </div>

      {status !== 'offline' && pending > 0 && (
        <button
          type="button"
          onClick={() => void runCloudSync()}
          className="text-[11px] underline font-bold uppercase tracking-wider hover:text-white"
        >
          Sync Now
        </button>
      )}
    </div>
  );
}
