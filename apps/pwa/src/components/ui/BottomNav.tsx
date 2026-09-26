import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useT } from '@/i18n';

function NavIcon({ name, active }: { name: 'learn' | 'review' | 'board' | 'profile'; active: boolean }) {
  const stroke = active ? '#00d4aa' : '#8b97ab';
  if (name === 'learn') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 6.5h16v11H4z" stroke={stroke} strokeWidth="1.8" />
        <path d="M8 10h8M8 13.5h5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === 'review') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 4v16M7 8l5-4 5 4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === 'board') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 18V10M12 18V6M19 18v-5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="3.2" stroke={stroke} strokeWidth="1.8" />
      <path d="M5.5 19c1.4-3 3.7-4.5 6.5-4.5S17.1 16 18.5 19" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav() {
  const t = useT();
  const location = useLocation();
  const items = [
    { to: '/learn/skill-tree', label: t('learn'), icon: 'learn' as const },
    { to: '/learn/review', label: t('review'), icon: 'review' as const },
    { to: '/learn/leaderboard', label: t('leaderboard'), icon: 'board' as const },
    { to: '/profile', label: t('profile'), icon: 'profile' as const },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-surface-light/70 bg-primary-dark/90 backdrop-blur-md">
      <div className="max-w-lg mx-auto grid grid-cols-4">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={clsx(
                'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                active ? 'text-accent' : 'text-muted'
              )}
            >
              <NavIcon name={item.icon} active={active} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
