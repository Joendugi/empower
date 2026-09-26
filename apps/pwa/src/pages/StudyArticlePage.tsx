import { Link, Navigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  Lock, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import TradeWorkshop from '@/components/anatomy/TradeWorkshop';
import VehicleAnatomy from '@/components/anatomy/VehicleAnatomy';
import BrandMark from '@/components/ui/BrandMark';
import ProfileButton from '@/components/ui/ProfileButton';
import { getPublicStudy, publicStudies } from '@/content/publicStudies';
import { useLearnerStore } from '@/store/learnerStore';
import { useT } from '@/i18n';

export default function StudyArticlePage() {
  const t = useT();
  const { slug } = useParams<{ slug: string }>();
  const token = useLearnerStore((state) => state.token);
  const isGuest = useLearnerStore((state) => state.isGuest);
  const signedIn = Boolean(token && !isGuest);

  const study = slug ? getPublicStudy(slug) : undefined;
  if (!study) return <Navigate to="/study" replace />;

  const siblings = publicStudies.filter((item) => item.programmeId === study.programmeId);
  const index = siblings.findIndex((item) => item.slug === study.slug);
  const previous = index > 0 ? siblings[index - 1] : undefined;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined;

  return (
    <div className="min-h-dvh bg-primary-dark text-white bg-grid-pattern">
      <header className="sticky top-0 z-30 bg-primary-dark/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            to={`/study?p=${study.programmeId}`}
            className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <BrandMark size="sm" />
            <span className="hidden sm:inline">{study.programmeTitle}</span>
          </Link>
          <div className="flex items-center gap-3">
            {signedIn ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            ) : (
              <Link to={`/login?next=${encodeURIComponent(`/study/${study.slug}`)}`} className="btn-secondary !py-1 !px-3 text-xs">
                <Lock className="w-3.5 h-3.5" /> Sign In
              </Link>
            )}
            <ProfileButton />
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Topic Banner */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-accent text-[11px] uppercase tracking-wider font-bold">
              {study.programmeIcon} {study.kicker}
            </span>
            <span className="text-xs text-muted flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {study.minutes} {t('minutes')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {study.title}
          </h1>
          <p className="text-sm sm:text-base text-muted-light mt-3 leading-relaxed">
            {study.summary}
          </p>
        </div>

        {/* Visual Workshop / Anatomy Stage */}
        <div className="card !p-6 border-white/[0.08] shadow-2xl">
          {study.anatomyKind ? (
            <VehicleAnatomy kind={study.anatomyKind} />
          ) : (
            <TradeWorkshop kit={study.tradeKit} />
          )}
        </div>

        {/* Article Body */}
        <div className="space-y-5 text-white/90 leading-relaxed text-base">
          {study.body.split(/\n\n+/).map((para, paragraphIndex) => (
            <p key={paragraphIndex} className="text-white/90">
              {para}
            </p>
          ))}
        </div>

        {/* Sources & Standards */}
        <section className="card !p-5 border-white/[0.08]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-accent" />
            {t('studySources')}
          </h2>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-light font-medium">
            {study.sources.map((source) => (
              <li key={source} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{source}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Account-Gated Practical Laboratory & Assessment CTA */}
        <div className="card !p-8 border-accent/30 bg-gradient-to-br from-surface to-surface-light relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hands-on Lab & Assessment</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {signedIn ? 'Ready for the Practical Assessment?' : 'Account Required for Practical Assessment & XP'}
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-lg leading-relaxed">
                {signedIn
                  ? 'Launch the interactive module to complete step-by-step autograded exercises, record workshop evidence, and earn XP.'
                  : 'Full interactive simulations, evidence uploads, and CDACC competency grading require an authenticated learner account.'}
              </p>
            </div>

            <div className="shrink-0 flex flex-col gap-2.5">
              <Link 
                to={signedIn ? study.lessonPath : `/login?next=${encodeURIComponent(study.lessonPath)}`} 
                className="btn-primary text-xs !py-3 !px-5"
              >
                <GraduationCap className="w-4 h-4" />
                {signedIn ? t('studyQuizCta') : 'Sign In to Start Quiz'}
              </Link>
              <Link to={`/study?p=${study.programmeId}`} className="btn-secondary text-xs !py-2.5 !px-5 text-center">
                {t('studyMore')}
              </Link>
            </div>
          </div>
        </div>

        {/* Pagination Navigation */}
        <nav className="flex justify-between items-center gap-3 text-xs font-semibold pt-4 border-t border-white/[0.08]">
          {previous ? (
            <Link to={`/study/${previous.slug}`} className="text-muted hover:text-white flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/study/${next.slug}`} className="text-accent hover:text-accent-light flex items-center gap-1.5 transition-colors">
              {next.title} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : null}
        </nav>
      </article>
    </div>
  );
}
