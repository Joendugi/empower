import { Link } from 'react-router-dom';
import { 
  SunMedium, 
  Droplets, 
  HeartPulse, 
  Sprout, 
  Recycle, 
  Hammer, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  GraduationCap,
  Play,
  Compass,
  Wrench,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { catalogueStats, getSkillPaths } from '@/content';
import { useT } from '@/i18n';
import BrandMark from '@/components/ui/BrandMark';
import ProfileButton from '@/components/ui/ProfileButton';
import { useLearnerStore } from '@/store/learnerStore';

export default function LandingPage() {
  const t = useT();
  const signedIn = Boolean(useLearnerStore((state) => state.token));
  const stats = catalogueStats();
  const paths = getSkillPaths().slice(0, 6);

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
          <Link to="/" className="flex items-center gap-3">
            <BrandMark size="sm" showText />
          </Link>

          <nav className="flex items-center gap-4 text-xs font-medium">
            <a href="#courses" className="text-muted hover:text-white hidden md:inline transition-colors">
              Courses
            </a>
            <a href="#impact" className="text-muted hover:text-white hidden md:inline transition-colors">
              Skills for society
            </a>
            <Link to="/educator" className="text-muted hover:text-white hidden md:inline transition-colors">
              Become an educator
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
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
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
                Empower brings semester-depth TVET, technical trades, ICT, and cybersecurity training to learners everywhere. Explore interactive workshop roadmaps, master practical competencies, and build a verified portfolio.
              </p>

              {/* Immediate CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3.5 max-w-lg">
                <Link to="/learn/skill-tree" className="btn-primary py-3.5 px-6 text-sm">
                  <GraduationCap className="w-4 h-4" />
                  Explore All Courses
                </Link>
                <Link to="/login" className="btn-secondary py-3.5 px-6 text-sm">
                  <Sparkles className="w-4 h-4" />
                  {signedIn ? 'My Account' : 'Open Account'}
                </Link>
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

            {/* Quick Course Launch Spotlight */}
            <div className="relative">
              <div className="card !p-6 border-accent/30 shadow-2xl shadow-accent/10 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-accent" />
                    <p className="text-xs text-accent font-bold uppercase tracking-widest">Featured TVET Tracks</p>
                  </div>
                  <span className="badge-accent text-[11px]">Instant Access</span>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    { id: 'motor-vehicle-mechanics', title: 'Motor Vehicle Mechanics', tag: 'Automotive', icon: Wrench, color: 'text-amber-400 bg-amber-400/10' },
                    { id: 'solar-energy', title: 'Solar PV & Electrical Systems', tag: 'Clean Energy', icon: Zap, color: 'text-cyan-400 bg-cyan-400/10' },
                    { id: 'secplus-concepts', title: 'Cybersecurity & Network Defense', tag: 'Security', icon: ShieldAlert, color: 'text-emerald-400 bg-emerald-400/10' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        to={`/learn/course/${item.id}`}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-surface/70 border border-white/[0.08] hover:border-accent/40 hover:bg-surface-light transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-muted font-medium">{item.tag}</p>
                            <h3 className="font-bold text-sm text-white group-hover:text-accent transition-colors">{item.title}</h3>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-primary-dark transition-all">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <span className="text-muted">No waitlist required</span>
                  <Link to="/learn/skill-tree" className="text-accent hover:underline flex items-center gap-1 font-semibold">
                    View all {stats.programmes} tracks <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instant Course Directory Section */}
        <section id="courses" className="border-t border-white/[0.08] py-16">
          <div className="max-w-7xl mx-auto px-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Curriculum Directory</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Start Any Course with One Click
                </h2>
                <p className="text-muted text-xs sm:text-sm mt-1">
                  Click any trade track to inspect the interactive learning roadmap.
                </p>
              </div>
              <Link to="/learn/skill-tree" className="btn-secondary !py-2 !px-4 text-xs shrink-0 inline-flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Browse Full Catalogue
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paths.map((p) => (
                <div key={p.id} className="card !p-5 border-white/[0.08] hover:border-accent/40 flex flex-col justify-between transition-all group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                        {p.track}
                      </span>
                      <span className="text-xs text-muted">
                        {p.nodes.length} modules
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-white group-hover:text-accent transition-colors">{p.title}</h3>
                    <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <Link
                      to={`/learn/course/${p.id}`}
                      className="btn-primary !py-2 !px-4 text-xs font-bold w-full justify-center"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Open Course Roadmap
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section id="impact" className="border-t border-white/[0.08] py-20 bg-surface/20">
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

        {/* CTA Callout */}
        <section className="max-w-5xl mx-auto px-5 py-20 text-center">
          <div className="card !p-10 border-accent/40 bg-gradient-to-b from-accent/[0.08] to-surface relative overflow-hidden shadow-2xl shadow-accent/10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Build a skill. Serve a community. Create work.
            </h2>
            <p className="text-muted-light mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Join learners mastering practical TVET trades, or apply to contribute verified technical curriculum.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3.5">
              <Link to="/login" className="btn-primary py-3 px-6 text-sm">
                Create free account
              </Link>
              <Link to="/learn/skill-tree" className="btn-secondary py-3 px-6 text-sm">
                Explore Curriculum
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
            <span>{t('swahiliEnglish')}</span>
            <span>{t('cdaccAligned')}</span>
          </div>
          <div className="flex items-center gap-4">
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
