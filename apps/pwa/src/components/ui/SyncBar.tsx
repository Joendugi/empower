import { CloudOff } from 'lucide-react';
import { useT } from '@/i18n';
import { useSyncStore } from '@/store/syncStore';

export default function SyncBar() {
  const t = useT();
  const status = useSyncStore((state) => state.status);

  if (status !== 'offline') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full px-4 py-1 text-xs font-medium flex items-center justify-center gap-2 border-b bg-amber-500/10 text-amber-400 border-amber-500/20"
    >
      <CloudOff className="w-3.5 h-3.5 shrink-0" />
      <span>{t('offline')}</span>
    </div>
  );
}
