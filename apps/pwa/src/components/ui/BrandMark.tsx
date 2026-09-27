import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export default function BrandMark({
  size = 'md',
  showText = false,
  to,
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  to?: string;
  className?: string;
}) {
  const box = {
    sm: 'w-8 h-8 rounded-md',
    md: 'w-10 h-10 rounded-md',
    lg: 'w-12 h-12 rounded-md',
  }[size];

  const letter = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];

  const mark = (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <div
        className={clsx(
          box,
          'flex items-center justify-center bg-accent text-white font-semibold'
        )}
      >
        <span className={clsx(letter, 'leading-none')}>E</span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-semibold tracking-tight text-white text-sm sm:text-base leading-tight">
            Empower
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-muted">
            TVET &amp; trades
          </span>
        </div>
      )}
    </div>
  );

  if (!to) return mark;
  return (
    <Link to={to} className="inline-flex items-center">
      {mark}
    </Link>
  );
}
