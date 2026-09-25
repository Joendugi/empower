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
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
        isHot && 'animate-streak-glow',
        isActive
          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          : 'bg-surface text-muted border border-surface-light',
        className
      )}
      title={`${streak}-day streak${streak === 0 ? ' — start learning today!' : ''}`}
    >
      <span className={clsx('text-base', isHot && 'animate-pulse-slow')}>
        {isActive ? '🔥' : '💤'}
      </span>
      <span>{streak}</span>
      {isHot && <span className="text-xs opacity-75">day streak!</span>}
    </div>
  );
}
