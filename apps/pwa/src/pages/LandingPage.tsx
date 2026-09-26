import { Link } from 'react-router-dom';
import { 
  SunMedium, 
  Droplets, 
  HeartPulse, 
  Sprout, 
  Recycle, 
  Hammer, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Award, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2,
  GraduationCap,
  Lock,
  KeyRound,
  ChevronRight
} from 'lucide-react';
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
    { icon: SunMedium, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', title: 'Clean energy', body: 'Solar PV installation, electrical safety, inverters, and battery maintenance.' },
    { icon: Droplets, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', title: 'Water & sanitation', body: 'Plumbing networks, rainwater harvesting, drainage, and WASH standards.' },
    { icon: HeartPulse, color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', title: 'Health & care', body: 'Community health practice, caregiving protocols, hygiene, and first response.' },
    { icon: Sprout, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', title: 'Food security', body: 'Modern agriculture, drip irrigation systems, post-harvesting, and agribusiness.' },
    { icon: Recycle, color: 'text-teal-400 bg-teal-400/10 border-teal-400/20', title: 'Circular economy', body: 'E-waste recovery, appliance repair, recycling flows, and material reuse.' },
    { icon: Hammer, color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', title: 'Safe communities', body: 'Masonry, structural carpentry, arc welding, HVAC, and resilient housing.' },
  ];

  return (
    <div className="min-h-dvh bg-primary-dark text-white bg-grid-pattern selection:bg-accent/30 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-primary-dark/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="flex items-center justify-between px-5 py-3.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <BrandMark size="sm" />
            <div>
              <p className="font-bold tracking-tight text-white">{t('brand')}</p>
              <p className="text-[10px] uppercase font-mono tracking-wider text-muted">{t('institution')}</p>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs font-medium">
            <a href="#security" className="text-muted hover:text-white hidden md:inline transition-colors">
              Security
            </a>
            <a href="#impact" className="text-muted hover:text-white hidden md:inline transition-colors">
              Skills for society
            </a>
            <Link to="/educator" className="text-muted hover:text-white hidden md:inline transition-colors">
              Become an educator
            </Link>
            <Link to="/study" className="text-muted hover:text-white hidden sm:inline transition-colors">
              {t('studyLibrary')}
            </Link>
            <ProfileButton />
            {!signedIn ? (
              <Link to="/login" className="btn-primary !py-2 !px-4 text-xs">
                {t('createFree')}
              </Link>
            ) : (
              <Link to="/learn/skill-tree" className="btn-primary !py-2 !px-4 text-xs">
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section with African TVET School Background Image */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
          {/* African TVET School Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-45 pointer-events-none"
            style={{ backgroundImage: "url('/images/tvet-school-hero.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/85 to-primary-dark/65 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-primary-dark/70 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-5 grid lg:grid-cols-[1.15fr_.85fr] gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-balance">
                Practical education for{' '}
                <span className="bg-gradient-to-r from-accent via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  work, enterprise,
                </span>{' '}
                and stronger communities.
              </h1>

              <p className="mt-6 text-base sm:text-lg text-muted-light max-w-2xl leading-relaxed">
                Empower brings semester-depth TVET, technical trades, ICT, and cybersecurity training to learners everywhere. Study structured notes, explore interactive workshop diagrams, and build a verified skills portfolio.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3.5 max-w-lg">
                <Link to="/study" className="btn-primary py-3.5 px-6 text-sm">
                  <BookOpen className="w-4 h-4" />
                  {t('studyBrowse')}
                </Link>
                <Link to="/login" className="btn-secondary py-3.5 px-6 text-sm">
                  <GraduationCap className="w-4 h-4" />
                  Sign up to save progress
                </Link>
              </div>

              {/* Security & Access Callout */}
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-light bg-surface/70 border border-white/[0.08] backdrop-blur-md px-3.5 py-2 rounded-xl max-w-lg">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span>Protected resource access: Sign in with a verified account to access full curriculum & tests.</span>
              </div>

              {/* Live Metric Stats Cards */}
              <dl className="mt-8 grid grid-cols-3 gap-3.5 max-w-lg">
                <div className="card !p-4 text-center border-white/[0.08] hover:border-accent/40 transition-colors">
                  <dt className="text-[11px] font-medium text-muted uppercase tracking-wider">{t('programmes')}</dt>
                  <dd className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">{stats.programmes}</dd>
                </div>
                <div className="card !p-4 text-center border-white/[0.08] hover:border-accent/40 transition-colors">
                  <dt className="text-[11px] font-medium text-muted uppercase tracking-wider">{t('modules')}</dt>
                  <dd className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">{stats.modules}</dd>
                </div>
                <div className="card !p-4 text-center border-white/[0.08] hover:border-accent/40 transition-colors">
                  <dt className="text-[11px] font-medium text-muted uppercase tracking-wider">{t('lessons')}</dt>
                  <dd className="text-2xl sm:text-3xl font-extrabold text-accent mt-1.5">{stats.lessons}</dd>
                </div>
              </dl>
            </div>

            {/* Interactive Feature Showcase Card */}
            <div className="relative">
              <div className="card !p-7 border-accent/30 shadow-2xl shadow-accent/10 relative overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" />
                    <p className="text-xs text-accent font-bold uppercase tracking-widest">A week on Empower</p>
                  </div>
                  <span className="badge-accent text-[11px]">Structured Standard</span>
                </div>

                <ol className="mt-6 space-y-5">
                  {[
                    { step: '01', title: 'Understand', desc: 'Read detailed notes tied to occupational standards and local trade practice.', icon: BookOpen },
                    { step: '02', title: 'Watch & Inspect', desc: 'See workshop demonstrations, exploded diagrams, and trainer explanations.', icon: Layers },
                    { step: '03', title: 'Practise & Test', desc: 'Answer scenarios, solve interactive challenges, and record practical evidence.', icon: CheckCircle2 },
                    { step: '04', title: 'Progress & Certify', desc: 'Unlock the next unit, earn XP, and keep a portable record of completed skills.', icon: Award },
                  ].map((item) => {
                    const StepIcon = item.icon;
                    return (
                      <li key={item.step} className="flex gap-4 items-start group">
                        <span className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-accent/20 to-surface-light text-accent border border-accent/30 grid place-items-center font-extrabold text-sm shadow-inner group-hover:scale-105 transition-transform">
                          {item.step}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-bold text-white text-base group-hover:text-accent transition-colors">{item.title}</h2>
                            <StepIcon className="w-3.5 h-3.5 text-muted group-hover:text-accent transition-colors" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-muted">
                  <span>Standardised CDACC / NITA mapping</span>
                  <Link to="/study" className="text-accent hover:underline flex items-center gap-1 font-semibold">
                    Explore notes <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features & Account Access Section */}
        <section id="security" className="border-t border-white/[0.08] bg-surface/40 py-16">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold mb-3">
                <Lock className="w-3.5 h-3.5" />
                <span className="tracking-wide uppercase">Protected Resource Architecture</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Account-Controlled Access & Security
              </h2>
              <p className="text-muted-light mt-3 text-sm sm:text-base leading-relaxed">
                All certified courseware, interactive practical assessments, and workshop evidence submissions are protected through cryptographic account authentication.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card !p-6 border-white/[0.08]">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white">Verified Account Gating</h3>
                <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                  Only authenticated learner and educator accounts can access full lesson exercises, autograding rubrics, and certification tracking.
                </p>
              </div>

              <div className="card !p-6 border-white/[0.08]">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white">Token Vault & Circuit Safety</h3>
                <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                  Session tokens are encrypted in the local secure vault with challenge-response protection against session hijacking.
                </p>
              </div>

              <div className="card !p-6 border-white/[0.08]">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white">Role-Based Access Control</h3>
                <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                  Distinct permission levels for Learners, TVET Trainers, Curriculum Editors, and Institutional Administrators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Public Study Programmes Grid */}
        <section className="border-t border-white/[0.08] bg-surface/20 py-20">
          <div className="max-w-7xl mx-auto px-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('studyWebKicker')}</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">{t('studyWebTitle')}</h2>
                <p className="text-muted-light mt-3 max-w-2xl text-sm sm:text-base leading-relaxed">{t('studyWebBody')}</p>
              </div>
              <Link to="/study" className="btn-secondary shrink-0 text-xs">
                {t('studyBrowse')} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicProgrammes.map((programme) => (
                <li key={programme.id}>
                  <Link
                    to={`/study?p=${programme.id}`}
                    className="card-interactive group block h-full p-6 border-white/[0.08]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                      {programme.icon}
                    </div>
                    <h3 className="font-bold text-lg text-white group-hover:text-accent transition-colors">{programme.title}</h3>
                    <p className="text-xs sm:text-sm text-muted mt-2 line-clamp-2 leading-relaxed">{programme.description}</p>
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="text-accent font-semibold">
                        {programme.count} {t('studyUnits')}
                      </span>
                      <span className="text-muted group-hover:text-white flex items-center gap-1 transition-colors">
                        Study notes <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Impact Areas */}
        <section id="impact" className="border-t border-white/[0.08] py-20">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Skills for society</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
                Train for the work every community needs
              </h2>
              <p className="text-muted-light mt-3 text-sm sm:text-base leading-relaxed">
                The catalogue combines established workshop trades with essential services that improve health, water, clean energy, food security, housing, and local enterprise.
              </p>
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {impactAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <li key={area.title} className="card !p-6 border-white/[0.08] hover:border-white/[0.15] transition-all">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${area.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-white">{area.title}</h3>
                    <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">{area.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Audience breakdown */}
        <section className="border-t border-white/[0.08] bg-surface/20 py-16">
          <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-3 gap-6">
            <div className="card !p-6 border-blue-500/20 bg-gradient-to-b from-blue-500/[0.06] to-transparent">
              <div className="flex items-center gap-2 text-blue-400 text-xs uppercase tracking-wider font-semibold">
                <GraduationCap className="w-4 h-4" />
                For learners
              </div>
              <h2 className="text-xl font-bold mt-3 text-white">A protected learning portal</h2>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Create an account to access structured curriculum, track streak, complete assessments, and submit workshop evidence.
              </p>
            </div>

            <div className="card !p-6 border-amber-500/20 bg-gradient-to-b from-amber-500/[0.06] to-transparent">
              <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-wider font-semibold">
                <Sparkles className="w-4 h-4" />
                For educators
              </div>
              <h2 className="text-xl font-bold mt-3 text-white">Teach with evidence</h2>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Author semester modules, outline notes, video walkthroughs, and autograded questions with real-time preview before publishing.
              </p>
            </div>

            <div className="card !p-6 border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.06] to-transparent">
              <div className="flex items-center gap-2 text-emerald-400 text-xs uppercase tracking-wider font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Quality assurance
              </div>
              <h2 className="text-xl font-bold mt-3 text-white">Admin validation before release</h2>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Content stays in a review queue until learning outcomes, depth, references, and assessment quality pass validation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Callout */}
        <section className="max-w-5xl mx-auto px-5 py-20 text-center">
          <div className="card !p-10 border-accent/40 bg-gradient-to-b from-accent/[0.08] to-surface relative overflow-hidden shadow-2xl shadow-accent/10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Build a skill. Serve a community. Create work.
            </h2>
            <p className="text-muted-light mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Join thousands of learners mastering practical TVET trades, or apply to contribute verified technical curriculum.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3.5">
              <Link to="/login" className="btn-primary py-3 px-6 text-sm">
                Create learner account
              </Link>
              <Link to="/login?next=%2Feducator" className="btn-secondary py-3 px-6 text-sm">
                Educator application
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Modernized Footer */}
      <footer className="border-t border-white/[0.08] bg-primary-dark/95">
        <div className="max-w-7xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-white">{t('brand')}</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-accent" /> Protected Resource Access</span>
            <span>{t('swahiliEnglish')}</span>
            <span>{t('cdaccAligned')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/study" className="hover:text-white transition-colors">
              {t('studyLibrary')}
            </Link>
            <Link to="/educator" className="hover:text-white transition-colors">
              Educators
            </Link>
            <Link to="/office" className="hover:text-white transition-colors">
              Office
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
