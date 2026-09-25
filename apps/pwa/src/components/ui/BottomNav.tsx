import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useT } from '@/i18n';

export default function BottomNav() {
  const t = useT();
  const location = useLocation();
  const items = [
    { to: '/learn/skill-tree', label: t('learn'), icon: '01' },
    { to: '/learn/review', label: t('review'), icon: '02' },
    { to: '/learn/leaderboard', label: t('leaderboard'), icon: '03' },
    { to: '/profile', label: t('profile'), icon: '04' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-surface-light bg-primary-dark/95 backdrop-blur">
      <div className="max-w-lg mx-auto grid grid-cols-4">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={clsx(
                'flex flex-col items-center py-3 text-xs',
                active ? 'text-accent' : 'text-muted'
              )}
            >
              <span className="text-base mb-1">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
