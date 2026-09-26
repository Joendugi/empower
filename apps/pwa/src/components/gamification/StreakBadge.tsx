import { clsx } from 'clsx';

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export default function StreakBadge({ streak, className = '' }: StreakBadgeProps) {
  const isHot = streak >= 7;
  const isActive = streak > 0;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-sm font-semibold border',
        isActive
          ? 'bg-orange-500/10 text-orange-300 border-orange-500/25'
          : 'bg-surface/60 text-muted border-surface-light',
        className
      )}
      title={`${streak}-day streak${streak === 0 ? ' — start learning today!' : ''}`}
    >
      <span
        className={clsx('w-1.5 h-1.5 rounded-sm', isActive ? 'bg-orange-400' : 'bg-muted')}
        aria-hidden
      />
      <span className="tabular-nums">{streak}</span>
      {isHot && <span className="text-xs font-medium opacity-80">day streak</span>}
    </div>
  );
}
