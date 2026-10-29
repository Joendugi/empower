import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield } from 'lucide-react';

interface RestorationEventProps {
  nodeTitle: string;
  nodeIcon: string;
  xpEarned: number;
  onDismiss: () => void;
}

const FLAVOUR_LINES = [
  'The network is live. Millions can connect again.',
  'Systems restored. The Corps salutes you.',
  'Infrastructure secured. The Rebuild continues.',
  'Another node lights up on the Civilization Map.',
  'Outstanding work, Rebuilder. East Africa thanks you.',
];

export default function RestorationEvent({
  nodeTitle,
  nodeIcon,
  xpEarned,
  onDismiss,
}: RestorationEventProps) {
  const flavour = useMemo(
    () => FLAVOUR_LINES[Math.floor(Math.random() * FLAVOUR_LINES.length)],
    [],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div
        className="card w-full max-w-sm !p-8 text-center border-emerald-500/20"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* Glowing icon circle */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-5 shadow-[0_0_32px_rgba(16,185,129,0.35)]">
          <span className="text-4xl leading-none" role="img" aria-hidden>
            {nodeIcon}
          </span>
        </div>

        {/* Badge line */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">
            Infrastructure Restored
          </span>
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          {nodeTitle} Online
        </h2>

        {/* Flavour line */}
        <p className="text-sm text-white/60 leading-relaxed mb-5 italic">{flavour}</p>

        {/* XP display */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-lg mb-6">
          +{xpEarned} XP
        </div>

        {/* Dismiss */}
        <button type="button" className="btn-primary w-full py-3 text-sm" onClick={onDismiss}>
          Continue the Rebuild →
        </button>
      </motion.div>
    </div>
  );
}
