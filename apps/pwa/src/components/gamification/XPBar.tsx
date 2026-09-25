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
      {/* Level badge */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-xp flex items-center justify-center">
        <span className="text-primary font-bold text-sm">{currentLevel}</span>
      </div>

      {/* Progress bar */}
      <div className="flex-1">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>{totalXp.toLocaleString()} XP</span>
          <span>Lvl {currentLevel + 1}: {xpNextLevel.toLocaleString()} XP</span>
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
