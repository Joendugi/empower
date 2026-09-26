import { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Command } from 'lucide-react';
import BrandMark from '@/components/ui/BrandMark';
import ProfileButton from '@/components/ui/ProfileButton';
import CommandPalette from '@/components/ui/CommandPalette';
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
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Global hotkey Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-primary-dark/85 backdrop-blur-xl border-b border-white/[0.08] shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Brand mark & logo */}
          <Link to={home} className="flex items-center gap-3 shrink-0 group">
            <BrandMark size="sm" />
            <div className="hidden sm:block">
              <span className="font-bold text-white text-base tracking-tight group-hover:text-accent transition-colors">
                {t('brand')}
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-wider text-muted">
                TVET & Skills Platform
              </span>
            </div>
          </Link>

          {/* Center search button or custom children */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            {children ? (
              children
            ) : (
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-xl bg-surface/80 border border-white/[0.08] text-muted hover:text-white hover:border-accent/40 hover:bg-surface-light/80 transition-all text-sm group shadow-inner"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                  <span className="text-xs text-muted-light font-normal">Search trades, lessons, articles...</span>
                </div>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white/[0.06] text-muted border border-white/[0.08]">
                  <Command className="w-2.5 h-2.5" /> K
                </kbd>
              </button>
            )}
          </div>

          {/* Quick links & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-muted">
              <Link 
                to="/study" 
                className={`px-3 py-1.5 rounded-lg transition-colors hover:text-white ${
                  location.pathname.startsWith('/study') ? 'text-accent bg-accent/10' : ''
                }`}
              >
                {t('studyLibrary')}
              </Link>
              <Link 
                to="/learn/skill-tree" 
                className={`px-3 py-1.5 rounded-lg transition-colors hover:text-white ${
                  location.pathname.startsWith('/learn') ? 'text-accent bg-accent/10' : ''
                }`}
              >
                {t('learn')}
              </Link>
            </nav>
            {trailing}
            <ProfileButton />
          </div>
        </div>
      </header>

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
