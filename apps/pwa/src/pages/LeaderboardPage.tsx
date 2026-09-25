import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import BottomNav from '@/components/ui/BottomNav';
import { useT } from '@/i18n';
import { useLearnerStore } from '@/store/learnerStore';

interface Entry {
  rank: number;
  learnerId: string;
  displayName?: string;
  totalXp: number;
  level?: number;
}

export default function LeaderboardPage() {
  const t = useT();
  const learnerId = useLearnerStore((s) => s.learnerId);
  const xp = useLearnerStore((s) => s.xp);
  const board = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api<Entry[]>('/leaderboard'),
  });
  const rows = board.data ?? [];

  return (
    <div className="min-h-dvh bg-primary-dark pb-24">
      <header className="px-4 py-4 border-b border-surface-light">
        <h1 className="font-bold text-white">{t('leaderboard')}</h1>
        <p className="text-xs text-muted mt-1">{t('topLearners')}</p>
      </header>
      <main className="max-w-lg mx-auto px-4 pt-6 space-y-2">
        {rows.length === 0 && (
          <p className="text-muted text-sm card">{xp > 0 ? t('emptyBoard') : t('emptyBoard')}</p>
        )}
        {rows.map((entry) => (
          <div
            key={entry.learnerId}
            className={`card flex items-center justify-between ${
              entry.learnerId === learnerId || entry.learnerId === 'local-guest' ? 'border-accent' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xp font-bold w-6">{entry.rank}</span>
              <div>
                <p className="text-white text-sm">
                  {entry.displayName ??
                    (entry.learnerId === learnerId ? 'You' : entry.learnerId.slice(0, 8))}
                </p>
                {entry.level ? <p className="text-xs text-muted">Lvl {entry.level}</p> : null}
              </div>
            </div>
            <span className="text-sm text-muted">{entry.totalXp.toLocaleString()} XP</span>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
