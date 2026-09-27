import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export type BadgeTone = 'neutral' | 'accent' | 'success';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const toneClass: Record<BadgeTone, string> = {
  neutral: 'bg-white/[0.06] border-white/[0.08] text-muted-light',
  accent: 'bg-accent/10 border-accent/25 text-accent-light',
  success: 'bg-success/10 border-success/30 text-success',
};

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border',
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}
