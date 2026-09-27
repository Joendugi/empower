import { clsx } from 'clsx';
import { Flame, Moon } from 'lucide-react';

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
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium',
        isActive
          ? 'bg-accent/10 text-accent border border-accent/30'
          : 'bg-surface text-muted border border-white/[0.08]',
        className
      )}
      title={`${streak}-day streak${streak === 0 ? ' — start learning today!' : ''}`}
    >
      {isActive ? (
        <Flame className={clsx('w-4 h-4 text-orange-400', isHot ? 'animate-bounce-once' : '')} />
      ) : (
        <Moon className="w-3.5 h-3.5 text-muted" />
      )}
      <span>{streak}</span>
      <span className="font-medium text-[11px] text-muted-light">
        {isHot ? 'days on fire!' : 'streak'}
      </span>
    </div>
  );
}
