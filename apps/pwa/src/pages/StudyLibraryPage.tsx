import { Link, useSearchParams } from 'react-router-dom';
import { publicProgrammes, publicStudies } from '@/content/publicStudies';
import AppHeader from '@/components/ui/AppHeader';
import CourseMark from '@/components/ui/CourseMark';
import SearchField from '@/components/ui/SearchField';
import { programmeMark } from '@/lib/courseMeta';
import { useT } from '@/i18n';

export default function StudyLibraryPage() {
  const t = useT();
  const [params, setParams] = useSearchParams();
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
    <div className="min-h-dvh text-white">
      <AppHeader
        trailing={
          <Link to="/login" className="text-sm text-muted hover:text-white hidden sm:inline">
            {t('login')}
          </Link>
        }
      />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <p className="section-kicker animate-rise-in">{t('studyWebKicker')}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 tracking-tight animate-rise-in">
          {t('studyWebTitle')}
        </h1>
        <p className="text-muted mt-3 max-w-3xl leading-relaxed animate-rise-in-delay">
          {t('studyWebBody')}
        </p>

        <div className="mt-6 max-w-xl animate-rise-in-delay">
          <SearchField
            value={query}
            onChange={(value) => setParam('q', value)}
            placeholder={t('searchStudies')}
          />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
          <label className="text-sm text-muted shrink-0">{t('studyByTrade')}</label>
          <select
            value={selected}
            onChange={(event) => setParam('p', event.target.value)}
            className="flex-1 rounded-xl bg-surface/70 border border-surface-light px-4 py-2.5 text-sm text-white"
          >
            <option value="all">{t('allProgrammes')}</option>
            {publicProgrammes.map((programme) => (
              <option key={programme.id} value={programme.id}>
                {programme.title}
              </option>
            ))}
          </select>
        </div>

        {showTradeGrid && (
          <section className="mt-8">
            <h2 className="font-display text-lg font-semibold mb-3">{t('studyByTrade')}</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {programmes.map((programme) => (
                <li key={programme.id}>
                  <button
                    type="button"
                    onClick={() => setParam('p', programme.id)}
                    className="programme-tile w-full text-left"
                    style={{ ['--tile-accent' as string]: '#00d4aa' }}
                  >
                    <div className="pl-2">
                      <CourseMark
                        mark={programmeMark(programme.id, programme.title)}
                        accent="#00d4aa"
                      />
                      <h3 className="font-display font-semibold text-lg mt-3">{programme.title}</h3>
                      <p className="text-sm text-muted mt-1 line-clamp-2 leading-relaxed">
                        {programme.description}
                      </p>
                      <p className="text-xs text-accent mt-3 font-medium">
                        {programme.count} {t('studyUnits')}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {showUnits && (
          <section className="mt-8">
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <h2 className="font-display text-lg font-semibold">
                {selectedProgramme ? selectedProgramme.title : t('searchResults')}
              </h2>
              <p className="text-sm text-muted">
                {studies.length} {t('studyUnits')}
              </p>
            </div>
            {studies.length === 0 ? (
              <p className="text-muted py-6">{t('noSearchResults')}</p>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-3">
                {studies.map((study) => (
                  <li key={study.slug}>
                    <Link to={`/study/${study.slug}`} className="unit-row block h-full">
                      <p className="text-[11px] uppercase tracking-wider text-accent">{study.kicker}</p>
                      <h3 className="font-display font-semibold mt-2">{study.title}</h3>
                      <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-3">
                        {study.summary}
                      </p>
                      <p className="text-xs text-muted mt-3">
                        {study.minutes} {t('minutes')} · {t('studyOpen')}
                      </p>
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
