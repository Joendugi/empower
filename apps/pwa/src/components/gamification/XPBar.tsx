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
  const xpIntoLevel = totalXp - xpThisLevel;
  const xpNeeded = xpNextLevel - xpThisLevel;
  const percent = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-xp/90 flex items-center justify-center">
        <span className="text-primary-dark font-display font-bold text-sm tabular-nums">
          {currentLevel}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span className="tabular-nums">{totalXp.toLocaleString()} XP</span>
          <span className="tabular-nums">
            Lvl {currentLevel + 1}: {xpNextLevel.toLocaleString()}
          </span>
        </div>
        <div className="xp-bar h-2">
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
