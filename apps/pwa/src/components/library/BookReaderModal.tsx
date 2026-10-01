import { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Download, 
  CheckCircle, 
  Menu, 
  Sun, 
  Moon, 
  BookMarked,
  Sparkles 
} from 'lucide-react';
import { useBookStore } from '@/store/bookStore';
import { useLearnerStore } from '@/store/learnerStore';
import type { Book } from '@cyberlearn/types';

interface BookReaderModalProps {
  book: Book | null;
  onClose: () => void;
}

export default function BookReaderModal({ book, onClose }: BookReaderModalProps) {
  const saveProgress = useBookStore((s) => s.saveProgress);
  const progressMap = useBookStore((s) => s.progress);
  const offlineBookIds = useBookStore((s) => s.offlineBookIds);
  const toggleOffline = useBookStore((s) => s.toggleOffline);
  const theme = useBookStore((s) => s.readerTheme);
  const setTheme = useBookStore((s) => s.setReaderTheme);
  const fontSize = useBookStore((s) => s.readerFontSize);
  const setFontSize = useBookStore((s) => s.setReaderFontSize);
  const addXp = useLearnerStore((s) => s.addXp);

  const [currentPage, setCurrentPage] = useState(1);
  const [showChapters, setShowChapters] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  useEffect(() => {
    if (book) {
      const existing = progressMap[book.id];
      if (existing) {
        setCurrentPage(existing.currentPage);
      } else {
        setCurrentPage(1);
      }
      setXpAwarded(false);
    }
  }, [book?.id]);

  if (!book) return null;

  const totalPages = book.totalPages || 50;
  const isOffline = offlineBookIds.includes(book.id);

  const goToPage = (page: number) => {
    const valid = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(valid);
    saveProgress(book.id, valid, totalPages);

    // Gamify reading: Award 10 XP on milestone progress
    if (!xpAwarded && valid >= Math.floor(totalPages * 0.25)) {
      addXp(10);
      setXpAwarded(true);
    }
  };

  const themeClasses = {
    dark: 'bg-primary-dark text-white/90',
    sepia: 'bg-[#f4ecd8] text-[#433422]',
    light: 'bg-white text-zinc-900',
  }[theme];

  const contentBgClasses = {
    dark: 'bg-surface/80 border-white/10',
    sepia: 'bg-[#eee4cb] border-[#dfd2b5]',
    light: 'bg-zinc-50 border-zinc-200',
  }[theme];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeClasses} animate-fadeIn select-none`}>
      {/* Top Reader Navbar */}
      <header className={`px-4 py-3 border-b flex items-center justify-between gap-3 ${
        theme === 'dark' ? 'border-white/10 bg-surface' : theme === 'sepia' ? 'border-[#e0d4b9] bg-[#ebdcc0]' : 'border-zinc-200 bg-zinc-100'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/10 transition-colors shrink-0"
            aria-label="Close reader"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h4 className="font-bold text-sm truncate">{book.title}</h4>
            <p className="text-[11px] opacity-75 truncate">{book.author} · {book.tradeTitle}</p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Chapter Drawer Toggle */}
          <button
            onClick={() => setShowChapters(!showChapters)}
            className="p-2 rounded-xl hover:bg-black/10 transition-colors relative"
            title="Table of Contents"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Offline Toggle */}
          <button
            onClick={() => toggleOffline(book.id)}
            className={`p-2 rounded-xl transition-colors ${
              isOffline ? 'text-emerald-500 font-semibold' : 'opacity-70 hover:opacity-100'
            }`}
            title={isOffline ? 'Available Offline' : 'Save for Offline Reading'}
          >
            {isOffline ? <CheckCircle className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          </button>

          {/* Theme Cycler */}
          <button
            onClick={() => {
              const next = theme === 'dark' ? 'sepia' : theme === 'sepia' ? 'light' : 'dark';
              setTheme(next);
            }}
            className="p-2 rounded-xl hover:bg-black/10 transition-colors"
            title="Toggle theme (Dark, Sepia, Light)"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Font Resizing */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-black/5 text-xs font-bold">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="px-1.5 py-0.5 hover:opacity-100 opacity-60"
            >
              A-
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="px-1.5 py-0.5 hover:opacity-100 opacity-60"
            >
              A+
            </button>
          </div>
        </div>
      </header>

      {/* Main Reading Viewport */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Table of Contents Drawer */}
        {showChapters && (
          <aside className={`absolute top-0 bottom-0 left-0 w-72 z-20 border-r shadow-2xl p-5 overflow-y-auto ${
            theme === 'dark' ? 'bg-surface border-white/10' : theme === 'sepia' ? 'bg-[#f4ecd8] border-[#dfd2b5]' : 'bg-white border-zinc-200'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/10">
              <h5 className="font-bold text-sm flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-accent" /> Chapters
              </h5>
              <button onClick={() => setShowChapters(false)} className="p-1 rounded hover:bg-black/5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-2 text-xs">
              {book.chapters?.map((ch) => (
                <li key={ch.id}>
                  <button
                    onClick={() => {
                      goToPage(ch.pageNumber);
                      setShowChapters(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between ${
                      currentPage >= ch.pageNumber ? 'font-bold text-accent bg-accent/10' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="truncate">{ch.title}</span>
                    <span className="opacity-60 text-[10px]">p. {ch.pageNumber}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Book Page Content */}
        <main className="flex-1 max-w-3xl mx-auto px-6 sm:px-12 py-8 overflow-y-auto leading-relaxed select-text">
          <div className={`p-6 sm:p-10 rounded-3xl border shadow-sm ${contentBgClasses} mb-12`}>
            {/* Header Stamp */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10 text-xs opacity-60">
              <span>Section {Math.min(5, Math.ceil(currentPage / 15))}</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>

            {/* Rendered Text */}
            <div
              style={{ fontSize: `${fontSize}px` }}
              className="space-y-5 leading-relaxed font-serif"
            >
              <h2 className="font-bold text-xl sm:text-2xl font-sans mb-4">
                {book.chapters?.[Math.min(book.chapters.length - 1, Math.floor((currentPage - 1) / (totalPages / (book.chapters.length || 1))))]?.title ?? book.title}
              </h2>

              <p>
                {book.description}
              </p>

              <div className="p-4 rounded-2xl bg-black/5 border border-black/5 font-mono text-xs my-4">
                <p className="font-bold uppercase mb-1">Practical Trade Standard</p>
                <p>NITA / CDACC Competency Framework · Unit: {book.cdaccUnitId || 'CU/TECH/GEN/01'}</p>
                <p>Field verification requires adherence to protective personal equipment (PPE) and tool calibration.</p>
              </div>

              {book.contentMarkdown ? (
                <div className="whitespace-pre-line text-sm opacity-90 leading-relaxed font-sans pt-2">
                  {book.contentMarkdown}
                </div>
              ) : (
                <p>
                  Continue reading this module through the practical assessment checklist.
                  Remember to log your equipment readings and verify zero voltage or mechanical lockouts before commencing hands-on workshop activity.
                </p>
              )}
            </div>

            {/* Page Footer */}
            <div className="mt-12 pt-4 border-t border-black/10 flex items-center justify-between text-xs opacity-60">
              <span>CyberLearn Kenya Open Education</span>
              <span>{Math.round((currentPage / totalPages) * 100)}% Finished</span>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Paging Toolbar */}
      <footer className={`px-4 py-3 border-t flex items-center justify-between gap-4 ${
        theme === 'dark' ? 'border-white/10 bg-surface' : theme === 'sepia' ? 'border-[#e0d4b9] bg-[#ebdcc0]' : 'border-zinc-200 bg-zinc-100'
      }`}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn-secondary !py-2 !px-4 text-xs font-semibold flex items-center gap-1 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Progress Slider */}
        <div className="flex-1 max-w-xs sm:max-w-md flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => goToPage(Number(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
          <span className="text-xs font-mono shrink-0">
            {currentPage}/{totalPages}
          </span>
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1 disabled:opacity-30"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
