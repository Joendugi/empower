import { courseAnalytics } from '@/lib/courseAnalytics';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useT } from '@/i18n';

export default function CourseAnalytics() {
  const t = useT();
  const events = useAnalyticsStore((state) => state.events);
  const stats = courseAnalytics(events);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">{t('analyticsTitle')}</h2>
        <p className="text-sm text-muted mt-2">{t('analyticsHelp')}</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <article className="card">
          <p className="text-xs text-muted">{t('analyticsEvents')}</p>
          <p className="text-2xl font-bold mt-1">{stats.totalEvents}</p>
        </article>
        <article className="card">
          <p className="text-xs text-muted">{t('analyticsPreferred')}</p>
          <p className="text-lg font-semibold mt-1">{stats.preferred?.path.title ?? t('analyticsNone')}</p>
        </article>
        <article className="card">
          <p className="text-xs text-muted">{t('analyticsTracks')}</p>
          <p className="text-sm mt-2">
            {t('tradesTrack')} {stats.tracks.trades} · {t('tvetTrack')} {stats.tracks.tvet} · {t('cyberTrack')}{' '}
            {stats.tracks.cybersecurity}
          </p>
        </article>
      </div>
      {stats.rows.length === 0 ? (
        <p className="card text-sm text-muted">{t('analyticsEmpty')}</p>
      ) : (
        <ul className="grid gap-3">
          {stats.rows.slice(0, 12).map((row) => (
            <li key={row.path.id} className="card flex flex-wrap justify-between gap-3">
              <div>
                <h3 className="font-semibold">{row.path.title}</h3>
                <p className="text-xs text-muted mt-1">{row.path.track ?? t('tradesTrack')}</p>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <dt className="text-muted">{t('analyticsChooses')}</dt>
                  <dd className="font-semibold">{row.chooses}</dd>
                </div>
                <div>
                  <dt className="text-muted">{t('analyticsOpens')}</dt>
                  <dd className="font-semibold">{row.opens}</dd>
                </div>
                <div>
                  <dt className="text-muted">{t('analyticsStarts')}</dt>
                  <dd className="font-semibold">{row.lessonStarts}</dd>
                </div>
                <div>
                  <dt className="text-muted">{t('analyticsCompletions')}</dt>
                  <dd className="font-semibold">{row.completions}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
