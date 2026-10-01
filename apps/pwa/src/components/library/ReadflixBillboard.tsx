import { BookOpen, CheckCircle, Download, Play, Plus, Star } from 'lucide-react';
import type { Book, BookProgress } from '@cyberlearn/types';

interface ReadflixBillboardProps {
  book: Book;
  progress?: BookProgress;
  isSaved?: boolean;
  isOffline?: boolean;
  onRead: (book: Book) => void;
  onToggleSave: (bookId: string) => void;
  onToggleOffline: (bookId: string) => void;
}

export default function ReadflixBillboard({
  book,
  progress,
  isSaved,
  isOffline,
  onRead,
  onToggleSave,
  onToggleOffline,
}: ReadflixBillboardProps) {
  const resumePage = progress?.currentPage ?? 1;
  const isStarted = Boolean(progress && progress.currentPage > 1);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-r from-surface-dark via-surface to-surface-dark mb-10">
      {/* Background Ambient Glow matching book cover */}
      <div
        className={`absolute -right-20 -top-20 w-96 h-96 rounded-full bg-gradient-to-br ${book.coverColor} opacity-20 blur-3xl pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10 p-6 sm:p-10">
        {/* 3D Angled Book Cover */}
        <div className="shrink-0 perspective-1000 group">
          <div
            className={`relative w-40 sm:w-52 aspect-[2/3] rounded-2xl bg-gradient-to-br ${book.coverColor} p-5 shadow-2xl border border-white/20 flex flex-col justify-between transform md:-rotate-2 group-hover:rotate-0 transition-transform duration-500`}
          >
            {/* Spine Highlight */}
            <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-black/30 border-r border-white/15" />

            <div className="pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-accent border border-accent/30">
                {book.fileFormat.toUpperCase()} · TVET
              </span>
            </div>

            <div className="pl-3 my-auto">
              <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight drop-shadow-md">
                {book.title}
              </h3>
              <p className="text-xs text-white/80 mt-1 font-medium">{book.author}</p>
            </div>

            <div className="pl-3 flex items-center justify-between text-[11px] text-white/70 pt-2 border-t border-white/15">
              <span>{book.totalPages} pages</span>
              <span>{book.estimatedMinutes}m read</span>
            </div>
          </div>
        </div>

        {/* Billboard Details & CTAs */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="badge-accent text-xs uppercase tracking-wider font-bold">
              ★ FEATURED FIELD MANUAL
            </span>
            {book.cdaccUnitId && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold border border-white/15">
                {book.cdaccUnitId}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              {book.rating ?? 4.9} ({book.readersCount?.toLocaleString() ?? '1,200'} readers)
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {book.title}
          </h2>

          <p className="text-sm sm:text-base text-muted-light max-w-2xl leading-relaxed">
            {book.description}
          </p>

          {/* Reading Progress Indicator */}
          {progress && (
            <div className="max-w-md mx-auto md:mx-0 space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-white/90 font-semibold">
                <span className="text-accent">{progress.percent}% Completed</span>
                <span className="text-muted">
                  Page {progress.currentPage} of {progress.totalPages}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={() => onRead(book)}
              className="btn-primary !py-3 !px-6 text-sm font-bold flex items-center gap-2 shadow-lg shadow-accent/20"
            >
              {isStarted ? (
                <>
                  <Play className="w-4 h-4 fill-primary-dark" />
                  Resume Page {resumePage}
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Start Reading
                </>
              )}
            </button>

            <button
              onClick={() => onToggleSave(book.id)}
              className={`btn-secondary !py-3 !px-4 text-xs font-semibold flex items-center gap-2 ${
                isSaved ? 'text-accent border-accent/40 bg-accent/10' : ''
              }`}
            >
              <Plus className={`w-4 h-4 ${isSaved ? 'rotate-45' : ''} transition-transform`} />
              {isSaved ? 'In My Shelf' : 'Add to Shelf'}
            </button>

            <button
              onClick={() => onToggleOffline(book.id)}
              className={`btn-secondary !py-3 !px-4 text-xs font-semibold flex items-center gap-2 ${
                isOffline ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : ''
              }`}
            >
              {isOffline ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Available Offline
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Save Offline ({book.fileSizeMb} MB)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
