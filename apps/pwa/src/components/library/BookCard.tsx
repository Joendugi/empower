import { CheckCircle, Star } from 'lucide-react';
import type { Book, BookProgress } from '@cyberlearn/types';

interface BookCardProps {
  book: Book;
  progress?: BookProgress;
  isOffline?: boolean;
  onSelect: (book: Book) => void;
  onToggleSave?: (bookId: string) => void;
}

export default function BookCard({
  book,
  progress,
  isOffline,
  onSelect,
}: BookCardProps) {
  return (
    <div
      onClick={() => onSelect(book)}
      className="group relative flex-none w-44 sm:w-52 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:z-10 focus:outline-none"
    >
      {/* Book Cover Card */}
      <div
        className={`relative aspect-[2/3] rounded-2xl bg-gradient-to-br ${book.coverColor} p-4 shadow-xl border border-white/10 flex flex-col justify-between overflow-hidden`}
      >
        {/* Subtle Spine Texture */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/25 border-r border-white/10" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-start justify-between gap-1 pl-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
            {book.fileFormat.toUpperCase()}
          </span>

          <div className="flex items-center gap-1">
            {isOffline && (
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-3 h-3" />
              </span>
            )}
            <span className="flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Star className="w-3 h-3 fill-amber-300" />
              {book.rating ?? 4.9}
            </span>
          </div>
        </div>

        {/* Middle Book Title on Cover */}
        <div className="relative z-10 pl-2 my-auto">
          <h4 className="font-bold text-sm sm:text-base text-white leading-snug line-clamp-3 drop-shadow-md">
            {book.title}
          </h4>
          <p className="text-[11px] text-white/70 mt-1 line-clamp-1">
            {book.author}
          </p>
        </div>

        {/* Bottom Metadata & Progress */}
        <div className="relative z-10 pl-2 space-y-2">
          {progress && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-white/80 font-medium">
                <span>{progress.percent}% read</span>
                <span>p. {progress.currentPage}/{progress.totalPages}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300 rounded-full"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-white/60 pt-1 border-t border-white/10">
            <span>{book.totalPages} pages</span>
            <span>{book.estimatedMinutes}m</span>
          </div>
        </div>
      </div>

      {/* Book Title below Card */}
      <div className="mt-2.5 px-1">
        <h5 className="font-semibold text-xs text-white line-clamp-1 group-hover:text-accent transition-colors">
          {book.title}
        </h5>
        <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
          {book.tradeTitle || book.category}
        </p>
      </div>
    </div>
  );
}
