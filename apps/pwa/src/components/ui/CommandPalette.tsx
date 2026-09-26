import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  RotateCcw, 
  User, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  X, 
  ArrowRight,
  Command
} from 'lucide-react';
import { publicStudies } from '@/content/publicStudies';
import { tradeProgrammes } from '@/content/trades';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Static navigation routes
  const quickLinks = useMemo(() => [
    { title: 'Learn Pathways & Modules', category: 'Navigation', icon: GraduationCap, path: '/learn/skill-tree', subtitle: 'Browse all trade curriculum trees' },
    { title: 'Study Library & Articles', category: 'Navigation', icon: BookOpen, path: '/study', subtitle: 'Detailed notes, sequences & diagrams' },
    { title: 'Review Mistakes & Flashcards', category: 'Navigation', icon: RotateCcw, path: '/learn/review', subtitle: 'Spaced repetition practice' },
    { title: 'Leaderboard & Rankings', category: 'Navigation', icon: Trophy, path: '/learn/leaderboard', subtitle: 'Learner league & weekly XP' },
    { title: 'Learner Profile & Stats', category: 'Navigation', icon: User, path: '/profile', subtitle: 'Portfolio, streak & offline storage' },
    { title: 'Curriculum Studio', category: 'Tools', icon: Layers, path: '/curriculum', subtitle: 'Author units, diagrams & exercises' },
    { title: 'Educator Center', category: 'Tools', icon: Sparkles, path: '/educator', subtitle: 'Facilitator & instructor management' },
    { title: 'Admin Office', category: 'Tools', icon: ShieldCheck, path: '/office', subtitle: 'System controls & challenges' },
  ], []);

  // Filtered results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return quickLinks;
    }

    const matchedLinks = quickLinks.filter(
      (l) => l.title.toLowerCase().includes(q) || l.subtitle.toLowerCase().includes(q)
    );

    const matchedProgrammes = tradeProgrammes
      .filter((p) => p.title.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)))
      .map((p) => ({
        title: p.title,
        category: 'Programme',
        icon: GraduationCap,
        path: `/learn/course/${p.id}`,
        subtitle: `${p.modules?.length ?? 0} modules • ${p.certificationTarget ?? 'TVET standard'}`,
      }));

    const matchedStudies = publicStudies
      .filter((s) => s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q) || s.programmeTitle.toLowerCase().includes(q))
      .slice(0, 8)
      .map((s) => ({
        title: s.title,
        category: 'Study Article',
        icon: BookOpen,
        path: `/study/${s.slug}`,
        subtitle: `${s.programmeTitle} • ${s.minutes} min read`,
      }));

    return [...matchedLinks, ...matchedProgrammes, ...matchedStudies];
  }, [query, quickLinks]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Key navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredResults[selectedIndex];
      if (target) {
        navigate(target.path);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-primary-dark/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-surface border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-primary-dark/40">
          <Search className="w-5 h-5 text-accent shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trades, lessons, articles, or tools... (Esc to close)"
            className="w-full bg-transparent text-white text-base placeholder:text-muted focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-muted bg-white/[0.06] rounded border border-white/[0.08]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 text-muted text-sm">
              No matching modules or articles found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={`${item.path}-${index}`}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected 
                      ? 'bg-accent/15 text-white border border-accent/30 shadow-[0_0_15px_rgba(0,212,170,0.1)]' 
                      : 'text-muted-light hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-accent/20 text-accent' : 'bg-surface-light text-muted'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate text-white">{item.title}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-muted border border-white/[0.06]">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate mt-0.5">{item.subtitle}</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-accent translate-x-0.5' : 'text-transparent'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-primary-dark/60 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-white/[0.06] rounded border border-white/[0.08]">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-white/[0.06] rounded border border-white/[0.08]">↵</kbd> select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" /> Quick Switcher
          </span>
        </div>
      </div>
    </div>
  );
}
