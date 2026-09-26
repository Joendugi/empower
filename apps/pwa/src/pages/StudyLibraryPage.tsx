import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  BookOpen, 
  Layers, 
  Clock, 
  ChevronRight, 
  UserCheck 
} from 'lucide-react';
import { publicProgrammes, publicStudies } from '@/content/publicStudies';
import AppHeader from '@/components/ui/AppHeader';
import SearchField from '@/components/ui/SearchField';
import { useLearnerStore } from '@/store/learnerStore';
import { useT } from '@/i18n';

export default function StudyLibraryPage() {
  const t = useT();
  const [params, setParams] = useSearchParams();
  const token = useLearnerStore((state) => state.token);
  const isGuest = useLearnerStore((state) => state.isGuest);
  const signedIn = Boolean(token && !isGuest);

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

  return (
    <div className="min-h-dvh bg-primary-dark text-white bg-grid-pattern">
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
        <div className="mb-6 card !p-4 bg-gradient-to-r from-surface to-surface-light border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                  ? 'Your account has verified clearance for theory notes, interactive workshop labs, and assessment logs.'
                  : 'Open study notes are viewable. Sign in with a verified account to access autograded quizzes, practical uploads & transcripts.'}
              </p>
            </div>
          </div>
          {!signedIn && (
            <Link to="/login?next=%2Fstudy" className="btn-primary shrink-0 text-xs !py-2 !px-4">
              Sign In to Unlock All
            </Link>
          )}
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('studyWebKicker')}</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">{t('studyWebTitle')}</h1>
        <p className="text-muted-light mt-3 max-w-3xl leading-relaxed text-sm sm:text-base">{t('studyWebBody')}</p>

        {/* Search and Filters */}
        <div className="mt-6 max-w-xl">
          <SearchField
            value={query}
            onChange={(value) => setParam('q', value)}
            placeholder={t('searchStudies')}
          />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted shrink-0">{t('studyByTrade')}:</label>
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
          <section className="mt-10">
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
                    <h3 className="font-bold text-base text-white group-hover:text-accent transition-colors">{programme.title}</h3>
                    <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed line-clamp-2">{programme.description}</p>
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

        {showUnits && (
          <section className="mt-10">
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
      </main>
    </div>
  );
}
