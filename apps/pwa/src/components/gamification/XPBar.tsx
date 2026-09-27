import { motion } from 'framer-motion';
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
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-surface-light border border-white/10 text-white text-sm font-semibold flex items-center justify-center">
        {currentLevel}
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
