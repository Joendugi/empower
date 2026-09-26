import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { GraduationCap, RotateCcw, Trophy, User } from 'lucide-react';
import { useT } from '@/i18n';

export default function BottomNav() {
  const t = useT();
  const location = useLocation();

  const items = [
    { to: '/learn/skill-tree', label: t('learn'), icon: GraduationCap },
    { to: '/learn/review', label: t('review'), icon: RotateCcw },
    { to: '/learn/leaderboard', label: t('leaderboard'), icon: Trophy },
    { to: '/profile', label: t('profile'), icon: User },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-md glass-dock rounded-2xl p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.5)] border border-white/[0.12]">
        <div className="grid grid-cols-4 gap-1">
          {items.map((item) => {
            const active = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={clsx(
                  'relative flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition-all duration-200',
                  active
                    ? 'text-accent bg-accent/15 shadow-[0_0_15px_rgba(0,212,170,0.15)] font-bold'
                    : 'text-muted hover:text-white hover:bg-white/[0.04]'
                )}
              >
                {active && (
                  <span className="absolute -top-1 w-6 h-1 rounded-full bg-accent shadow-[0_0_8px_rgba(0,212,170,0.8)]" />
                )}
                <Icon className={clsx('w-5 h-5 mb-1 transition-transform', active ? 'scale-110' : '')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
