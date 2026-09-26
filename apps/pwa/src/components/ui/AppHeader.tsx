import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import BrandMark from '@/components/ui/BrandMark';
import ProfileButton from '@/components/ui/ProfileButton';
import { useT } from '@/i18n';

export default function AppHeader({
  home = '/',
  trailing,
  children,
}: {
  home?: string;
  trailing?: ReactNode;
  children?: ReactNode;
}) {
  const t = useT();

  return (
    <header className="sticky top-0 z-20 bg-primary-dark/85 backdrop-blur-md border-b border-surface-light/70">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to={home} className="flex items-center gap-2 shrink-0">
          <BrandMark size="sm" />
          <span className="font-display font-semibold tracking-tight text-white hidden sm:inline">{t('brand')}</span>
        </Link>
        <div className="flex-1 min-w-0">{children}</div>
        <div className="flex items-center gap-2 shrink-0">
          {trailing}
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}
