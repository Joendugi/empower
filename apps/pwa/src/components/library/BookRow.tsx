import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Book, BookProgress } from '@cyberlearn/types';
import BookCard from './BookCard';

interface BookRowProps {
  title: string;
  subtitle?: string;
  books: Book[];
  progressMap?: Record<string, BookProgress>;
  offlineIds?: string[];
  onSelectBook: (book: Book) => void;
  onToggleSave?: (bookId: string) => void;
}

export default function BookRow({
  title,
  subtitle,
  books,
  progressMap = {},
  offlineIds = [],
  onSelectBook,
  onToggleSave,
}: BookRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  if (books.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const distance = 450;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative mb-8 group/row">
      <div className="flex items-baseline justify-between mb-3 px-1">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>

        {/* Scroll Controls (Desktop) */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={rowRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none pb-4 pt-1 px-1 scroll-smooth"
      >
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            progress={progressMap[book.id]}
            isOffline={offlineIds.includes(book.id)}
            onSelect={onSelectBook}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    </section>
  );
}
