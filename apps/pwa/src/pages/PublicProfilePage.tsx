import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Radio, 
  Globe, 
  ArrowLeft, 
  QrCode
} from 'lucide-react';
import AppHeader from '@/components/ui/AppHeader';
import BottomNav from '@/components/ui/BottomNav';
import { CIVILIZATION_NODES } from '@/components/narrative/civilizationData';
import { useLearnerStore } from '@/store/learnerStore';

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const activeUser = useLearnerStore((s) => s.displayName);
  const totalXp = useLearnerStore((s) => s.xp);
  const currentLevel = useLearnerStore((s) => s.level);
  const completedLessonIds = useLearnerStore((s) => s.completedLessonIds);

  const displayName = username ? decodeURIComponent(username) : (activeUser || 'Rebuilder Cadet');

  // Derive Rank
  const rank = useMemo(() => {
    if (currentLevel >= 20) return { label: 'Commander', level: 20, icon: '⭐' };
    if (currentLevel >= 15) return { label: 'Architect', level: 15, icon: '🏛️' };
    if (currentLevel >= 10) return { label: 'Specialist', level: 10, icon: '🛡️' };
    if (currentLevel >= 6) return { label: 'Engineer', level: 6, icon: '⚙️' };
    if (currentLevel >= 3) return { label: 'Technician', level: 3, icon: '🔧' };
    return { label: 'Recruit', level: 1, icon: '🌱' };
  }, [currentLevel]);

  // Derived Restored Nodes
  const restoredNodes = useMemo(() => {
    return CIVILIZATION_NODES.map((node, i) => ({
      ...node,
      isRestored: i === 0 || completedLessonIds.length > i * 2,
    }));
  }, [completedLessonIds]);

  const restoredCount = restoredNodes.filter((n) => n.isRestored).length;

  return (
    <div className="min-h-dvh bg-primary-dark pb-24 text-white">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Back link */}
        <Link to="/profile" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        {/* Hero Card */}
        <div className="card bg-gradient-to-r from-emerald-950/40 via-surface-dark to-black border border-emerald-500/30 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-1 flex items-center justify-center text-4xl shadow-lg shrink-0">
              {rank.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                  REBUILDER CORPS RECORD
                </span>
                <span className="text-xs font-mono text-muted">ID: #RB-2031-{displayName.slice(0, 4).toUpperCase()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">{displayName}</h1>
              <p className="text-xs text-muted font-mono mt-0.5 flex items-center gap-1.5 justify-center sm:justify-start">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Rank: <strong className="text-emerald-300 uppercase">{rank.label}</strong> (Level {currentLevel}) · {totalXp} XP
              </p>
            </div>
          </div>

          <div className="bg-black/60 border border-surface-light/40 rounded-xl p-3 text-center shrink-0 w-full sm:w-auto">
            <div className="text-[10px] font-mono text-muted uppercase">Restoration Index</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
              {restoredCount} / {CIVILIZATION_NODES.length}
            </div>
            <div className="text-[10px] font-mono text-muted mt-0.5">Infrastructure Outposts Online</div>
          </div>
        </div>

        {/* Restored Civilization Nodes Showcase */}
        <section className="card p-6 border-surface-light/40 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-light/30">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Civilization Outposts Restored
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">{restoredCount} Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {restoredNodes.map((node) => (
              <div
                key={node.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  node.isRestored
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-black/30 border-surface-light/20 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{node.icon}</span>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">{node.title}</h3>
                    <p className="text-[10px] text-muted font-mono truncate">{node.region}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold shrink-0 ${
                    node.isRestored ? 'bg-emerald-500/20 text-emerald-300' : 'bg-surface-dark text-muted'
                  }`}
                >
                  {node.isRestored ? 'ONLINE' : 'DARK'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Credentials & Verified OpenBadges */}
        <section className="card p-6 border-surface-light/40 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-light/30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Verified Cryptographic Credentials
              </h2>
            </div>
            <span className="text-xs font-mono text-muted">OpenBadges v3 Compliant</span>
          </div>

          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Rebuilder Initiate — Digital Citizenship</h3>
                <p className="text-[11px] text-muted font-mono mt-0.5">KNQA Level 4 · CDACC Foundation Verified</p>
              </div>
            </div>

            <Link
              to="/verify"
              className="btn-secondary !py-1.5 !px-3 text-xs flex items-center justify-center gap-1.5 shrink-0"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Verify Assertion</span>
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
