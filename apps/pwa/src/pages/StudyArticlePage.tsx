import { Link, Navigate, useParams } from 'react-router-dom';
import TradeWorkshop from '@/components/anatomy/TradeWorkshop';
import VehicleAnatomy from '@/components/anatomy/VehicleAnatomy';
import BrandMark from '@/components/ui/BrandMark';
import ProfileButton from '@/components/ui/ProfileButton';
import { getPublicStudy, publicStudies } from '@/content/publicStudies';
import { useT } from '@/i18n';

export default function StudyArticlePage() {
  const t = useT();
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? getPublicStudy(slug) : undefined;
  if (!study) return <Navigate to="/study" replace />;

  const siblings = publicStudies.filter((item) => item.programmeId === study.programmeId);
  const index = siblings.findIndex((item) => item.slug === study.slug);
  const previous = index > 0 ? siblings[index - 1] : undefined;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined;

  return (
    <div className="min-h-dvh bg-primary-dark text-white">
      <header className="sticky top-0 z-20 bg-primary-dark/90 backdrop-blur border-b border-surface-light">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between gap-3">
          <Link
            to={`/study?p=${study.programmeId}`}
            className="flex items-center gap-2 text-sm text-muted hover:text-white"
          >
            <BrandMark size="sm" />
            {study.programmeTitle}
          </Link>
          <ProfileButton />
        </div>
      </header>
      <article className="max-w-3xl mx-auto px-5 py-10 space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {study.programmeIcon} {study.kicker}
        </p>
        <h1 className="text-3xl font-bold">{study.title}</h1>
        <p className="text-sm text-muted">
          {study.minutes} {t('minutes')} · {t('studyWebHint')}
        </p>
        {study.anatomyKind ? (
          <VehicleAnatomy kind={study.anatomyKind} />
        ) : (
          <TradeWorkshop kit={study.tradeKit} />
        )}
        {study.body.split(/\n\n+/).map((para, paragraphIndex) => (
          <p key={paragraphIndex} className="text-white/90 leading-relaxed">
            {para}
          </p>
        ))}
        <section className="card">
          <h2 className="text-sm font-semibold text-muted">{t('studySources')}</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {study.sources.map((source) => (
              <li key={source}>• {source}</li>
            ))}
          </ul>
        </section>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={`/login?next=${encodeURIComponent(study.lessonPath)}`} className="btn-primary text-center">
            {t('studyQuizCta')}
          </Link>
          <Link to={`/study?p=${study.programmeId}`} className="btn-secondary text-center">
            {t('studyMore')}
          </Link>
        </div>
        <nav className="flex justify-between gap-3 text-sm pt-2">
          {previous ? (
            <Link to={`/study/${previous.slug}`} className="text-accent hover:underline">
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/study/${next.slug}`} className="text-accent hover:underline text-right">
              {next.title} →
            </Link>
          ) : null}
        </nav>
      </article>
    </div>
  );
}
