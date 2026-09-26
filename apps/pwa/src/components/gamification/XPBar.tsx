import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { xpToLevel } from '@/store/learnerStore';

interface XPBarProps {
  totalXp: number;
  className?: string;
}

/** XP needed to reach the next level: level^2 * 100 */
function xpForLevel(level: number): number {
  return level * level * 100;
}

export default function XPBar({ totalXp, className = '' }: XPBarProps) {
  const currentLevel = xpToLevel(totalXp);
  const xpThisLevel = xpForLevel(currentLevel - 1);
  const xpNextLevel = xpForLevel(currentLevel);
  const xpIntoLevel = Math.max(0, totalXp - xpThisLevel);
  const xpNeeded = Math.max(1, xpNextLevel - xpThisLevel);
  const percent = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Level badge */}
      <div className="flex-shrink-0 relative">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-primary-dark font-extrabold text-sm flex items-center justify-center shadow-glow-xp border border-yellow-200/40">
          <span className="flex items-center gap-0.5">
            <Trophy className="w-3.5 h-3.5 opacity-80" />
            {currentLevel}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center text-xs text-muted mb-1.5 font-medium">
          <span className="text-white font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            {totalXp.toLocaleString()} XP
          </span>
          <span className="text-[11px] text-muted">
            Next Level: {xpNextLevel.toLocaleString()} XP ({percent}%)
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
