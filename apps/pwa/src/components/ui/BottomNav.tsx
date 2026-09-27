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
    <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-white/[0.08] bg-primary-dark">
      <div className="mx-auto max-w-md grid grid-cols-4">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={clsx(
                'flex flex-col items-center justify-center py-2.5 px-1 text-[11px] font-medium border-t-2 transition-colors',
                active
                  ? 'text-white border-accent'
                  : 'text-muted border-transparent hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
