import { clsx } from 'clsx';

const sizeClass = {
  sm: 'w-8 h-8 text-[10px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-12 h-12 text-sm',
} as const;

export default function CourseMark({
  mark,
  accent = '#00d4aa',
  size = 'md',
  muted,
  className,
}: {
  mark: string;
  accent?: string;
  size?: keyof typeof sizeClass;
  muted?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        sizeClass[size],
        'inline-flex items-center justify-center rounded-xl font-display font-bold tracking-tight shrink-0 border',
        muted
          ? 'bg-surface-light/40 text-muted border-surface-light'
          : 'bg-primary-dark/70 text-ink border-surface-light/80',
        className
      )}
      style={muted ? undefined : { color: accent, borderColor: `${accent}55` }}
      aria-hidden
    >
      {mark.slice(0, 3)}
    </span>
  );
}
