import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLearnerStore } from '@/store/learnerStore';
import BottomNav from '@/components/ui/BottomNav';
import { useT } from '@/i18n';
import type { ReviewCard } from '@cyberlearn/types';

interface ReviewSession {
  learnerId: string;
  cards: ReviewCard[];
  generatedAt: string;
  totalDue: number;
}

export default function ReviewPage() {
  const t = useT();
  const token = useLearnerStore((s) => s.token);
  const applyXp = useLearnerStore((s) => s.applyXp);
  const session = useQuery({
    queryKey: ['review', token],
    queryFn: () => api<ReviewSession>('/review/session'),
    enabled: Boolean(token),
  });
  const cards = session.data?.cards ?? [];

  const rate = async (contentId: string, rating: number) => {
    const result = await api<{ totalXp: number; level: number }>('/review/result', {
      method: 'POST',
      body: JSON.stringify({ contentId, rating }),
    });
    applyXp(result.totalXp, result.level);
    await session.refetch();
  };

  return (
    <div className="min-h-dvh bg-primary-dark pb-24">
      <header className="px-4 py-4 border-b border-surface-light">
        <h1 className="font-bold text-white">{t('review')}</h1>
        <p className="text-xs text-muted mt-1">
          {session.data?.totalDue ?? 0} {t('dueToday')}
        </p>
      </header>
      <main className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        {!token && <p className="text-muted text-sm card">{t('noReviews')}</p>}
        {token && cards.length === 0 && <p className="text-muted text-sm card">{t('noReviews')}</p>}
        {cards.map((card) => (
          <div key={card.contentId} className="card space-y-3">
            <p className="text-white font-medium">{card.contentId}</p>
            <p className="text-xs text-muted">
              {card.state} · reps {card.reps}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                [1, t('rateAgain')],
                [2, t('rateHard')],
                [3, t('rateGood')],
                [4, t('rateEasy')],
              ].map(([value, label]) => (
                <button
                  key={String(value)}
                  className="btn-secondary py-2 text-xs"
                  onClick={() => void rate(card.contentId, Number(value))}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
