import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export default function BrandMark({
  size = 'md',
  to,
}: {
  size?: 'sm' | 'md' | 'lg';
  to?: string;
}) {
  const box = { sm: 'w-9 h-9 text-lg', md: 'w-12 h-12 text-2xl', lg: 'w-16 h-16 text-3xl' }[size];
  const mark = (
    <span
      className={clsx(
        box,
        'inline-flex items-center justify-center rounded-2xl bg-accent text-primary font-black tracking-tight shadow-[0_0_24px_rgba(0,212,170,0.25)]'
      )}
    >
      E
    </span>
  );
  if (!to) return mark;
  return (
    <Link to={to} className="inline-flex items-center gap-3">
      {mark}
    </Link>
  );
}
