import { useState } from 'react';
import { clsx } from 'clsx';
import { DownloadCloud, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import type { SkillPath } from '@cyberlearn/types';
import { useLibraryStore, packStatusFor } from '@/store/libraryStore';

interface CourseDownloadButtonProps {
  path: SkillPath;
  className?: string;
}

export default function CourseDownloadButton({ path, className = '' }: CourseDownloadButtonProps) {
  const pack = useLibraryStore((state) => state.packs[path.id] ?? packStatusFor(path.id));
  const selectProgramme = useLibraryStore((state) => state.selectProgramme);
  const [busy, setBusy] = useState(false);

  const status = pack?.status ?? 'idle';
  const isReady = status === 'ready';
  const isDownloading = status === 'downloading' || busy;
  const isError = status === 'error';

  const total = (pack?.lessonIds.length ?? path.nodes.flatMap((n) => n.lessonIds).length) + (pack?.mediaTotal ?? 0);
  const current = (pack?.lessonsReady ?? 0) + (pack?.mediaReady ?? 0);
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;
    setBusy(true);
    selectProgramme(path.id);
    setTimeout(() => setBusy(false), 800);
  };

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      {isReady ? (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-[0_0_12px_rgba(46,213,115,0.15)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Downloaded Offline</span>
        </div>
      ) : isDownloading ? (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/15 border border-accent/30 text-accent text-xs font-semibold">
          <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
          <span>Saving {percent}%</span>
          <div className="w-12 h-1.5 rounded-full bg-surface-light overflow-hidden ml-1">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : isError ? (
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-danger/15 border border-danger/30 text-rose-300 text-xs font-semibold hover:bg-danger/25 transition-colors"
          title={pack?.error ?? 'Retry download'}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Retry Download</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-light/90 border border-white/[0.1] text-muted-light hover:text-white hover:border-accent/40 hover:bg-surface-lighter transition-all text-xs font-semibold group shadow-sm"
        >
          <DownloadCloud className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform" />
          <span>Save for Offline</span>
        </button>
      )}
    </div>
  );
}
