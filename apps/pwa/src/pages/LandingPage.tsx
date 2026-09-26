import { Link } from 'react-router-dom';
import { publicProgrammes } from '@/content/publicStudies';
import { useT } from '@/i18n';
import BrandMark from '@/components/ui/BrandMark';
import CourseMark from '@/components/ui/CourseMark';
import ProfileButton from '@/components/ui/ProfileButton';
import { programmeMark } from '@/lib/courseMeta';
import { useLearnerStore } from '@/store/learnerStore';

export default function LandingPage() {
  const t = useT();
  const signedIn = Boolean(useLearnerStore((state) => state.token));
  const featured = publicProgrammes.slice(0, 6);

  return (
    <div className="min-h-dvh text-white">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="flex items-center justify-between px-5 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <BrandMark size="sm" />
            <p className="font-display font-semibold tracking-tight">{t('brand')}</p>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/study" className="text-ink/70 hover:text-white hidden sm:inline">
              {t('studyLibrary')}
            </Link>
            <ProfileButton />
            {!signedIn && (
              <Link to="/login" className="btn-primary !py-2 !px-4">
                {t('createFree')}
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* First viewport: brand, one headline, one sentence, CTAs, full-bleed workshop visual */}
        <section className="relative min-h-dvh flex items-end overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/hero-workshop.svg"
              alt=""
              className="h-full w-full object-cover animate-pan-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/75 to-primary-dark/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/40 to-transparent" />
          </div>

          <div className="relative w-full max-w-6xl mx-auto px-5 pb-16 pt-32 sm:pb-24">
            <p className="font-display text-5xl sm:text-7xl font-extrabold tracking-tight text-white animate-rise-in">
              {t('brand')}
            </p>
            <h1 className="mt-4 max-w-2xl text-2xl sm:text-4xl font-display font-bold leading-tight text-balance animate-rise-in-delay">
              Practical trades and TVET for work that builds Kenya.
            </h1>
            <p className="mt-4 max-w-xl text-base sm:text-lg text-ink/75 leading-relaxed animate-rise-in-late">
              Workshop-depth notes, demonstrations, and evidence — online first, then on your device.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md animate-rise-in-late">
              <Link to={signedIn ? '/learn/skill-tree' : '/login'} className="btn-primary text-center">
                {signedIn ? t('learn') : t('createFree')}
              </Link>
              <Link to="/study" className="btn-secondary text-center">
                {t('studyBrowse')}
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-surface-light/60">
          <div className="max-w-6xl mx-auto px-5 py-16 sm:py-20">
            <p className="section-kicker">{t('studyWebKicker')}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">{t('studyWebTitle')}</h2>
            <p className="text-muted mt-3 max-w-2xl leading-relaxed">{t('studyWebBody')}</p>
            <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((programme) => (
                <li key={programme.id}>
                  <Link
                    to={`/study?p=${programme.id}`}
                    className="programme-tile block"
                    style={{ ['--tile-accent' as string]: '#00d4aa' }}
                  >
                    <CourseMark
                      mark={programmeMark(programme.id, programme.title)}
                      accent="#00d4aa"
                    />
                    <h3 className="font-display font-semibold text-lg mt-3">{programme.title}</h3>
                    <p className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">{programme.description}</p>
                    <p className="text-xs text-accent mt-4 font-medium">
                      {programme.count} {t('studyUnits')}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/study" className="btn-secondary inline-flex">
                {t('studyBrowse')}
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-surface-light/60 bg-surface/25">
          <div className="max-w-6xl mx-auto px-5 py-16 sm:py-20 grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
            <div>
              <p className="section-kicker">How it works</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">
                Understand. Practise. Prove it.
              </h2>
              <p className="text-muted mt-3 leading-relaxed max-w-lg">
                One clear loop for polytechnic learners: read the unit, watch the floor demo, then submit
                evidence you can show a supervisor.
              </p>
            </div>
            <ol className="space-y-0 divide-y divide-surface-light/70 border-y border-surface-light/70">
              {[
                ['01', 'Study the unit', 'Semester-depth notes mapped to CDACC and workshop practice.'],
                ['02', 'Watch the demo', 'See the sequence before you pick up tools or open a terminal.'],
                ['03', 'Submit evidence', 'Quizzes and practical capture build a portable skills record.'],
              ].map(([number, title, body]) => (
                <li key={number} className="py-5 flex gap-5">
                  <span className="font-display text-2xl font-bold text-accent tabular-nums">{number}</span>
                  <div>
                    <h3 className="font-display font-semibold text-lg">{title}</h3>
                    <p className="text-sm text-muted mt-1 leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,212,170,0.14),transparent_45%)]" />
          <div className="relative max-w-3xl mx-auto px-5 py-20 text-center">
            <p className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">{t('brand')}</p>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              Build a hireable skill. Keep progress on this device when campus Wi‑Fi drops.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/login" className="btn-primary">
                Create learner account
              </Link>
              <Link to="/login?next=%2Feducator" className="btn-secondary">
                Educator application
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-light/60">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-wrap gap-4 text-xs text-muted">
          <span className="font-display font-semibold text-ink/80">{t('brand')}</span>
          <span>{t('worksOffline')}</span>
          <span>{t('swahiliEnglish')}</span>
          <span>{t('cdaccAligned')}</span>
          <Link to="/study" className="hover:text-white">
            {t('studyLibrary')}
          </Link>
        </div>
      </footer>
    </div>
  );
}
