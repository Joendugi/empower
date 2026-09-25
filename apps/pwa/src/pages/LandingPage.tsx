import { Link } from 'react-router-dom';
import { catalogueStats } from '@/content';
import { publicProgrammes } from '@/content/publicStudies';
import { useT } from '@/i18n';
import BrandMark from '@/components/ui/BrandMark';
import ProfileButton from '@/components/ui/ProfileButton';
import { useLearnerStore } from '@/store/learnerStore';

export default function LandingPage() {
  const t = useT();
  const signedIn = Boolean(useLearnerStore((state) => state.token));
  const stats = catalogueStats();
  const impactAreas = [
    { icon: '☀️', title: 'Clean energy', body: 'Solar installation, electrical safety, and energy maintenance.' },
    { icon: '💧', title: 'Water & sanitation', body: 'Plumbing, rainwater harvesting, drainage, and WASH practice.' },
    { icon: '🩺', title: 'Health & care', body: 'Community health support, caregiving, hygiene, and first response.' },
    { icon: '🌱', title: 'Food security', body: 'Agriculture, irrigation, food handling, and agribusiness.' },
    { icon: '♻️', title: 'Circular economy', body: 'Waste recovery, repair, recycling, and safe material handling.' },
    { icon: '🏠', title: 'Safe communities', body: 'Masonry, carpentry, welding, refrigeration, and resilient housing.' },
  ];

  return (
    <div className="min-h-dvh bg-primary-dark text-white">
      <header className="sticky top-0 z-20 bg-primary-dark/90 backdrop-blur border-b border-surface-light">
        <div className="flex items-center justify-between px-5 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <BrandMark size="sm" />
          <div>
            <p className="font-semibold leading-none">{t('brand')}</p>
            <p className="text-[11px] text-muted mt-1">{t('institution')}</p>
          </div>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <a href="#impact" className="text-muted hover:text-white hidden sm:inline">
            Skills for society
          </a>
          <Link to="/educator" className="text-muted hover:text-white hidden sm:inline">
            Become an educator
          </Link>
          <Link to="/study" className="text-muted hover:text-white hidden sm:inline">
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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(0,229,195,0.12),transparent_42%)]" />
          <div className="relative max-w-6xl mx-auto px-5 py-16 lg:py-24 grid lg:grid-cols-[1.15fr_.85fr] gap-12 items-center">
          <div>
            <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Learn · practise · prove your skill
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold leading-[1.08] text-balance">
              Practical education for work, enterprise, and stronger communities.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
              Empower brings semester-depth TVET, trades, ICT, and cybersecurity training to learners across
              Kenya. Study structured notes, watch demonstrations, complete practical evidence, and build a
              verified skills record.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
              <Link to="/study" className="btn-primary text-center">
                {t('studyBrowse')}
              </Link>
              <Link to="/login" className="btn-secondary text-center">
                Sign up to save progress
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted">{t('studyWebHint')}</p>
            <dl className="mt-10 grid grid-cols-3 gap-3 max-w-lg">
              <div className="card !p-3 text-center">
                <dt className="text-[11px] text-muted uppercase tracking-wide">{t('programmes')}</dt>
                <dd className="text-2xl font-bold mt-1">{stats.programmes}</dd>
              </div>
              <div className="card !p-3 text-center">
                <dt className="text-[11px] text-muted uppercase tracking-wide">{t('modules')}</dt>
                <dd className="text-2xl font-bold mt-1">{stats.modules}</dd>
              </div>
              <div className="card !p-3 text-center">
                <dt className="text-[11px] text-muted uppercase tracking-wide">{t('lessons')}</dt>
                <dd className="text-2xl font-bold mt-1">{stats.lessons}</dd>
              </div>
            </dl>
          </div>
          <div className="card !p-6 border-accent/30 shadow-2xl shadow-accent/5">
            <p className="text-xs text-accent font-semibold uppercase tracking-widest">A week on Empower</p>
            <ol className="mt-6 space-y-5">
              {[
                ['01', 'Understand', 'Read detailed notes tied to occupational standards and local practice.'],
                ['02', 'Watch', 'See workshop demonstrations, animations, and trainer explanations.'],
                ['03', 'Practise', 'Answer scenarios and record video, audio, or photo evidence of practical work.'],
                ['04', 'Progress', 'Unlock the next unit and keep a portable record of completed skills.'],
              ].map(([number, title, body]) => (
                <li key={number} className="flex gap-4">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-accent/10 text-accent grid place-items-center font-bold">
                    {number}
                  </span>
                  <div>
                    <h2 className="font-semibold">{title}</h2>
                    <p className="text-sm text-muted mt-1 leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          </div>
        </section>

        <section className="border-t border-surface-light">
          <div className="max-w-6xl mx-auto px-5 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{t('studyWebKicker')}</p>
            <h2 className="text-3xl font-bold mt-2">{t('studyWebTitle')}</h2>
            <p className="text-muted mt-3 max-w-3xl leading-relaxed">{t('studyWebBody')}</p>
            <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {publicProgrammes.map((programme) => (
                <li key={programme.id}>
                  <Link
                    to={`/study?p=${programme.id}`}
                    className="card block h-full hover:border-accent/50 transition-colors"
                  >
                    <span className="text-2xl">{programme.icon}</span>
                    <h3 className="font-semibold mt-2">{programme.title}</h3>
                    <p className="text-sm text-muted mt-1 line-clamp-2">{programme.description}</p>
                    <p className="text-xs text-accent mt-3">
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

        <section id="impact" className="border-y border-surface-light bg-surface/20">
          <div className="max-w-6xl mx-auto px-5 py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Skills for society</p>
            <h2 className="text-3xl font-bold mt-2">Train for the work every community needs</h2>
            <p className="text-muted mt-3 max-w-3xl leading-relaxed">
              The catalogue combines established workshop trades with services that improve health, water,
              clean energy, food security, housing, and local enterprise.
            </p>
            <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {impactAreas.map((area) => (
                <li key={area.title} className="card !p-5">
                  <span className="text-3xl">{area.icon}</span>
                  <h3 className="font-semibold mt-3">{area.title}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{area.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 py-16 grid lg:grid-cols-3 gap-5">
          <div className="card">
            <p className="text-xs uppercase tracking-wider text-blue-300">For learners</p>
            <h2 className="text-xl font-bold mt-2">A protected learning portal</h2>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              Create an account to access curriculum, save progress, complete assessments, and submit practical evidence.
            </p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-wider text-amber-300">For educators</p>
            <h2 className="text-xl font-bold mt-2">Teach with evidence</h2>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              After sign-up, write Week 1 and Week 2 the way a learner sees them: outline, notes, videos, and autograded questions. Review the layout before you publish.
            </p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-wider text-success">Quality assurance</p>
            <h2 className="text-xl font-bold mt-2">Admin validation before release</h2>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              Content stays in a review queue until learning outcomes, depth, references, assessment quality, and media security pass.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-5 pb-16 text-center">
          <div className="card !p-8 border-accent/30">
            <h2 className="text-3xl font-bold">Build a skill. Serve a community. Create work.</h2>
            <p className="text-muted mt-3">Join as a learner, or apply to share verified industry knowledge.</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/login" className="btn-primary">Create learner account</Link>
              <Link to="/login?next=%2Feducator" className="btn-secondary">Educator application</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-light">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-wrap gap-4 text-xs text-muted">
          <span>{t('brand')}</span>
          <span>{t('worksOffline')}</span>
          <span>{t('swahiliEnglish')}</span>
          <span>{t('cdaccAligned')}</span>
          <Link to="/study" className="hover:text-white">
            {t('studyLibrary')}
          </Link>
          <span>Quizzes and certificates need an account. Notes can be read in any browser.</span>
        </div>
      </footer>
    </div>
  );
}
