import { motion } from 'framer-motion';
import { xpToLevel, useLearnerStore } from '@/store/learnerStore';

interface XPBarProps {
  totalXp: number;
  className?: string;
}

/** XP needed to reach the next level: level^2 * 100 */
function xpForLevel(level: number): number {
  return level * level * 100;
}

const REBUILDER_RANKS: Array<{ minLevel: number; label: string; labelSw: string }> = [
  { minLevel: 1,  label: 'Recruit',    labelSw: 'Mwanajeshi' },
  { minLevel: 3,  label: 'Technician', labelSw: 'Fundi' },
  { minLevel: 6,  label: 'Engineer',   labelSw: 'Mhandisi' },
  { minLevel: 10, label: 'Specialist', labelSw: 'Mtaalamu' },
  { minLevel: 15, label: 'Architect',  labelSw: 'Msanifu' },
  { minLevel: 20, label: 'Commander',  labelSw: 'Kamanda' },
];

function getRank(level: number) {
  let rank = REBUILDER_RANKS[0];
  for (const r of REBUILDER_RANKS) {
    if (level >= r.minLevel) rank = r;
  }
  return rank;
}

export default function XPBar({ totalXp, className = '' }: XPBarProps) {
  const language = useLearnerStore((s) => s.language);
  const narrativeTheme = useLearnerStore((s) => s.narrativeTheme ?? true);
  const currentLevel = xpToLevel(totalXp);
  const xpThisLevel = xpForLevel(currentLevel - 1);
  const xpNextLevel = xpForLevel(currentLevel);
  const xpIntoLevel = Math.max(0, totalXp - xpThisLevel);
  const xpNeeded = Math.max(1, xpNextLevel - xpThisLevel);
  const percent = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));
  const rank = getRank(currentLevel);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
        <div className="w-10 h-10 rounded-md bg-surface-light border border-white/10 text-white text-sm font-semibold flex items-center justify-center">
          {currentLevel}
        </div>
        {narrativeTheme ? (
          <span className="text-[10px] uppercase tracking-widest text-accent font-bold leading-none">
            {language === 'sw' ? rank.labelSw : rank.label}
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-wider text-muted font-mono leading-none">
            L{currentLevel}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center text-xs text-muted mb-1.5">
          <span className="text-white font-medium">{totalXp.toLocaleString()} XP</span>
          <span className="text-[11px]">
            Next: {xpNextLevel.toLocaleString()} ({percent}%)
          </span>
        </div>
        <div className="xp-bar">
          <motion.div
            className="xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
