import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  BookOpen, 
  Layers, 
  Clock, 
  ChevronRight, 
  UserCheck,
  UploadCloud,
  Film,
  Bookmark,
  CheckCircle2,
  FolderDown
} from 'lucide-react';
import { publicProgrammes, publicStudies } from '@/content/publicStudies';
import AppHeader from '@/components/ui/AppHeader';
import SearchField from '@/components/ui/SearchField';
import { useIsEducator } from '@/lib/roles';
import { useEducatorStore } from '@/store/educatorStore';
import { useLearnerStore } from '@/store/learnerStore';
import { useBookStore } from '@/store/bookStore';
import { useT } from '@/i18n';
import type { Book } from '@cyberlearn/types';
import ReadflixBillboard from '@/components/library/ReadflixBillboard';
import BookRow from '@/components/library/BookRow';
import BookUploadModal from '@/components/library/BookUploadModal';
import BookReaderModal from '@/components/library/BookReaderModal';

export default function StudyLibraryPage() {
  const t = useT();
  const [params, setParams] = useSearchParams();
  const token = useLearnerStore((state) => state.token);
  const isGuest = useLearnerStore((state) => state.isGuest);
  const signedIn = Boolean(token && !isGuest);
  const teaching = useIsEducator();
  const instructorNotes = useEducatorStore((state) => state.notes);

  // Readflix Book Store State
  const books = useBookStore((s) => s.books);
  const progressMap = useBookStore((s) => s.progress);
  const savedBookIds = useBookStore((s) => s.savedBookIds);
  const offlineBookIds = useBookStore((s) => s.offlineBookIds);
  const toggleSaved = useBookStore((s) => s.toggleSaved);
  const toggleOffline = useBookStore((s) => s.toggleOffline);
  const fetchBooks = useBookStore((s) => s.fetchBooks);

  // Local UI State
  const [activeTab, setActiveTab] = useState<'readflix' | 'trades' | 'shelf'>('readflix');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  const selected = params.get('p') ?? 'all';
  const query = params.get('q') ?? '';
  const needle = query.trim().toLowerCase();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || (key === 'p' && value === 'all')) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const matchesQuery = (values: Array<string | undefined>) =>
    !needle || values.some((value) => value?.toLowerCase().includes(needle));

  const programmes = publicProgrammes.filter((programme) =>
    matchesQuery([programme.title, programme.description, programme.id])
  );
  const studies = publicStudies.filter(
    (study) =>
      (selected === 'all' || study.programmeId === selected) &&
      matchesQuery([study.title, study.summary, study.kicker, study.programmeTitle, study.body])
  );
  const selectedProgramme = publicProgrammes.find((programme) => programme.id === selected);
  const showTradeGrid = selected === 'all' && !needle;
  const showUnits = Boolean(selectedProgramme || needle);
  const visibleNotes = instructorNotes.filter(
    (note) =>
      (selected === 'all' || note.programmeId === selected) &&
      matchesQuery([note.title, note.body, note.programmeTitle])
  );

  // Filtered Books for Readflix Rows
  const filteredBooks = books.filter((b) =>
    matchesQuery([b.title, b.titleSw, b.author, b.description, b.tradeTitle, b.category])
  );

  const continueReadingBooks = filteredBooks.filter((b) => progressMap[b.id] && progressMap[b.id].percent > 0 && progressMap[b.id].percent < 100);
  const resilienceBooks = filteredBooks.filter((b) => b.category === 'resilience' || b.category === 'agriculture');
  const engineeringBooks = filteredBooks.filter((b) => b.category === 'engineering' || b.category === 'tvet-trade');
  const healthBooks = filteredBooks.filter((b) => b.category === 'health');
  const savedBooks = filteredBooks.filter((b) => savedBookIds.includes(b.id));
  const offlineBooks = filteredBooks.filter((b) => offlineBookIds.includes(b.id));

  // Determine billboard book: either first currently-reading book or first featured book
  const billboardBook = continueReadingBooks[0] || filteredBooks.find((b) => b.featured) || filteredBooks[0];

  return (
    <div className="min-h-dvh bg-primary-dark text-white">
      <AppHeader
        trailing={
          !signedIn ? (
            <Link to="/login?next=%2Fstudy" className="btn-primary !py-1.5 !px-3 text-xs hidden sm:inline-flex">
              <KeyRound className="w-3.5 h-3.5" /> Sign In
            </Link>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
            </span>
          )
        }
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Security & Access Status Banner */}
        <div className="mb-6 card !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/15 border border-accent/30 text-accent shrink-0">
              {signedIn ? <UserCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  {signedIn ? 'Account-Gated Access Unlocked' : 'Resource Security & Protected Learning'}
                </span>
                <span className="badge-accent text-[10px]">TVET Standard</span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                {signedIn
                  ? 'Your account has verified clearance for manual downloads, e-reader sync & practical assessment logs.'
                  : 'Open manuals and theory notes are viewable. Sign in with a verified account to sync bookmarks and track progress.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="btn-secondary !py-2 !px-3.5 text-xs font-semibold flex items-center gap-1.5 border-accent/30 text-accent hover:bg-accent/10"
            >
              <UploadCloud className="w-4 h-4" /> Upload Book
            </button>
            {!signedIn && (
              <Link to="/login?next=%2Fstudy" className="btn-primary text-xs !py-2 !px-4">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">READFLIX & STUDY LIBRARY</p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-1 text-white">
              Technical Manuals & Studies
            </h1>
            <p className="text-muted-light mt-2 max-w-2xl leading-relaxed text-sm">
              Explore offline-first technical field guides, vocational trade handbooks, and civilization resilience manuals.
            </p>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center p-1 rounded-2xl bg-surface border border-white/10 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('readflix')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'readflix'
                  ? 'bg-accent text-primary-dark shadow-md font-bold'
                  : 'text-muted hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Readflix Books
            </button>
            <button
              onClick={() => setActiveTab('trades')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'trades'
                  ? 'bg-accent text-primary-dark shadow-md font-bold'
                  : 'text-muted hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Trade Modules
            </button>
            <button
              onClick={() => setActiveTab('shelf')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'shelf'
                  ? 'bg-accent text-primary-dark shadow-md font-bold'
                  : 'text-muted hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" /> My Shelf ({savedBookIds.length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-xl">
          <SearchField
            value={query}
            onChange={(value) => setParam('q', value)}
            placeholder="Search manuals, authors, CDACC codes, or topics..."
          />
        </div>

        {/* ── TAB 1: READFLIX MODE ──────────────────────────── */}
        {activeTab === 'readflix' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Cinematic Hero Billboard */}
            {billboardBook && !needle && (
              <ReadflixBillboard
                book={billboardBook}
                progress={progressMap[billboardBook.id]}
                isSaved={savedBookIds.includes(billboardBook.id)}
                isOffline={offlineBookIds.includes(billboardBook.id)}
                onRead={(b) => setReadingBook(b)}
                onToggleSave={toggleSaved}
                onToggleOffline={toggleOffline}
              />
            )}

            {/* Swimlane 1: Continue Reading */}
            {continueReadingBooks.length > 0 && (
              <BookRow
                title="Continue Reading"
                subtitle="Pick up exactly where you left off"
                books={continueReadingBooks}
                progressMap={progressMap}
                offlineIds={offlineBookIds}
                onSelectBook={(b) => setReadingBook(b)}
                onToggleSave={toggleSaved}
              />
            )}

            {/* Swimlane 2: Civilization Renewal & Resilience */}
            <BookRow
              title="Civilization Renewal & Resilience"
              subtitle="Engineering drinking water, food security, solar PV, and wilderness trauma"
              books={resilienceBooks}
              progressMap={progressMap}
              offlineIds={offlineBookIds}
              onSelectBook={(b) => setReadingBook(b)}
              onToggleSave={toggleSaved}
            />

            {/* Swimlane 3: Engineering & Trades */}
            <BookRow
              title="Engineering & Vocational Workshop Manuals"
              subtitle="Welding, electrical, automotive, and mechanics standards"
              books={engineeringBooks}
              progressMap={progressMap}
              offlineIds={offlineBookIds}
              onSelectBook={(b) => setReadingBook(b)}
              onToggleSave={toggleSaved}
            />

            {/* Swimlane 4: Emergency Health */}
            <BookRow
              title="Emergency Health & Community First Response"
              subtitle="Haemorrhage control, burns, airway management, and disaster triage"
              books={healthBooks}
              progressMap={progressMap}
              offlineIds={offlineBookIds}
              onSelectBook={(b) => setReadingBook(b)}
              onToggleSave={toggleSaved}
            />

            {/* Swimlane 5: Available Offline */}
            {offlineBooks.length > 0 && (
              <BookRow
                title="Downloaded & Available Offline"
                subtitle="Cached locally on your device for zero-data reading"
                books={offlineBooks}
                progressMap={progressMap}
                offlineIds={offlineBookIds}
                onSelectBook={(b) => setReadingBook(b)}
                onToggleSave={toggleSaved}
              />
            )}
          </div>
        )}

        {/* ── TAB 2: TRADE MODULES (ORIGINAL VIEW) ─────────── */}
        {activeTab === 'trades' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted shrink-0">
                {t('studyByTrade')}:
              </label>
              <select
                value={selected}
                onChange={(event) => setParam('p', event.target.value)}
                className="flex-1 rounded-xl bg-surface border border-white/[0.08] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50"
              >
                <option value="all">{t('allProgrammes')}</option>
                {publicProgrammes.map((programme) => (
                  <option key={programme.id} value={programme.id}>
                    {programme.icon} {programme.title}
                  </option>
                ))}
              </select>
            </div>

            {showTradeGrid && (
              <section className="mt-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent" />
                  {t('studyByTrade')}
                </h2>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {programmes.map((programme) => (
                    <li key={programme.id}>
                      <button
                        type="button"
                        onClick={() => setParam('p', programme.id)}
                        className="card-interactive w-full text-left h-full !p-6 border-white/[0.08] group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                          {programme.icon}
                        </div>
                        <h3 className="font-bold text-base text-white group-hover:text-accent transition-colors">
                          {programme.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                          {programme.description}
                        </p>
                        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                          <span className="text-accent font-semibold">
                            {programme.count} {t('studyUnits')}
                          </span>
                          <span className="text-muted group-hover:text-white flex items-center gap-1">
                            View Units <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {visibleNotes.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold mb-4">Instructor notes</h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {visibleNotes.map((note) => (
                    <li key={note.id}>
                      <Link
                        to={note.slug ? `/study/${note.slug}` : `/study?p=${note.programmeId}`}
                        className="card-interactive block h-full !p-6 border-white/[0.08]"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-wider text-accent">
                          {note.programmeTitle}
                          {note.sample ? ' · sample' : ''}
                        </p>
                        <h3 className="font-bold text-base text-white mt-2">{note.title}</h3>
                        <p className="text-xs text-muted mt-2 line-clamp-3">{note.body}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {showUnits && (
              <section className="mt-8">
                <div className="flex items-baseline justify-between gap-3 mb-6 pb-2 border-b border-white/[0.08]">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    {selectedProgramme
                      ? `${selectedProgramme.icon} ${selectedProgramme.title}`
                      : t('searchResults')}
                  </h2>
                  <p className="text-xs text-muted font-medium">
                    {studies.length} {t('studyUnits')} available
                  </p>
                </div>

                {studies.length === 0 ? (
                  <div className="card !p-8 text-center text-muted text-sm border-white/[0.08]">
                    {t('noSearchResults')}
                  </div>
                ) : (
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {studies.map((study) => (
                      <li key={study.slug}>
                        <Link
                          to={`/study/${study.slug}`}
                          className="card-interactive block h-full !p-6 border-white/[0.08] group"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                              <span>{study.programmeIcon}</span>
                              <span>{study.kicker}</span>
                            </p>
                            <span className="text-xs text-muted flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {study.minutes} {t('minutes')}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-white group-hover:text-accent transition-colors leading-snug">
                            {study.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed line-clamp-3">
                            {study.summary}
                          </p>

                          <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                            <span className="text-muted flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Verified Notes
                            </span>
                            <span className="text-accent font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              {t('studyOpen')} <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>
        )}

        {/* ── TAB 3: PERSONAL SHELF ────────────────────────── */}
        {activeTab === 'shelf' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Saved Books */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-accent" /> Saved to My Library
              </h2>
              {savedBooks.length === 0 ? (
                <div className="card !p-8 text-center text-muted text-sm border-white/10">
                  You haven’t saved any manuals to your shelf yet. Browse the Readflix tab and click "+ Add to Shelf".
                </div>
              ) : (
                <div className="flex flex-wrap gap-5">
                  {savedBooks.map((b) => (
                    <div key={b.id} onClick={() => setReadingBook(b)} className="cursor-pointer">
                      <div className={`w-44 aspect-[2/3] rounded-2xl bg-gradient-to-br ${b.coverColor} p-4 shadow-xl border border-white/10 flex flex-col justify-between`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-white w-max">
                          {b.fileFormat.toUpperCase()}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-2">{b.title}</h4>
                          <p className="text-[11px] text-white/70 mt-1">{b.author}</p>
                        </div>
                        <span className="text-[10px] text-white/60">{b.totalPages} pages</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Offline Books */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FolderDown className="w-5 h-5 text-emerald-400" /> Offline Downloaded Manuals
              </h2>
              {offlineBooks.length === 0 ? (
                <div className="card !p-8 text-center text-muted text-sm border-white/10">
                  No books downloaded yet. Download any manual to read without internet connection.
                </div>
              ) : (
                <div className="flex flex-wrap gap-5">
                  {offlineBooks.map((b) => (
                    <div key={b.id} onClick={() => setReadingBook(b)} className="cursor-pointer">
                      <div className={`w-44 aspect-[2/3] rounded-2xl bg-gradient-to-br ${b.coverColor} p-4 shadow-xl border border-white/10 flex flex-col justify-between`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/40 text-white">
                            OFFLINE
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-2">{b.title}</h4>
                          <p className="text-[11px] text-white/70 mt-1">{b.author}</p>
                        </div>
                        <span className="text-[10px] text-white/60">{b.fileSizeMb} MB</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Book Upload Modal */}
      <BookUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={(created) => {
          setReadingBook(created);
        }}
      />

      {/* Immersive Book Reader Modal */}
      {readingBook && (
        <BookReaderModal
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}
    </div>
  );
}
