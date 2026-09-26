import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Zap } from 'lucide-react';

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
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
  }[size];

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size];

  const mark = (
    <div className={clsx('flex items-center gap-3', className)}>
      <div
        className={clsx(
          box,
          'relative flex items-center justify-center bg-gradient-to-br from-accent via-teal-400 to-emerald-500 p-[1px] shadow-glow-sm hover:shadow-glow transition-all duration-300 group'
        )}
      >
        <div className="w-full h-full bg-primary-dark/90 backdrop-blur-md rounded-[inherit] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-center font-black text-accent tracking-tighter">
            <span className="text-base sm:text-lg font-black bg-gradient-to-b from-white via-accent-light to-accent bg-clip-text text-transparent">
              E
            </span>
            <Zap className={clsx(iconSize, 'text-accent absolute -right-1 -top-1 opacity-40 group-hover:opacity-80 transition-opacity transform rotate-12')} />
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-white text-base sm:text-lg leading-tight flex items-center gap-1">
            EMPOWER
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-muted">
            TVET & Technical Skills
          </span>
        </div>
      )}
    </div>
  );

  if (!to) return mark;
  return (
    <Link to={to} className="inline-flex items-center group">
      {mark}
    </Link>
  );
}
