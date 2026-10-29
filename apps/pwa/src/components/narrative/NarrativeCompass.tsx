import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Compass, Navigation2 } from 'lucide-react';
import type { CivilizationNode, CompassHeading } from '@cyberlearn/types';
import { calculateBearing, calculateDistanceKm, getHeading } from './civilizationData';
import { playRadarBeep } from '@/lib/soundEffects';

interface NarrativeCompassProps {
  originNode: CivilizationNode;
  targetNode: CivilizationNode | null;
  onSelectTarget?: (node: CivilizationNode) => void;
  availableNodes?: CivilizationNode[];
  language?: string;
}

export const NarrativeCompass: React.FC<NarrativeCompassProps> = ({
  originNode,
  targetNode,
  onSelectTarget,
  availableNodes = [],
  language = 'en',
}) => {
  const isSw = language === 'sw';

  const { bearing, distanceKm, heading } = useMemo(() => {
    if (!targetNode || !originNode.x || !originNode.y || !targetNode.x || !targetNode.y) {
      return { bearing: 0, distanceKm: 0, heading: 'N' as CompassHeading };
    }
    const deg = calculateBearing(originNode.x, originNode.y, targetNode.x, targetNode.y);
    const dist = calculateDistanceKm(originNode.x, originNode.y, targetNode.x, targetNode.y);
    const h = getHeading(deg);
    return { bearing: deg, distanceKm: dist, heading: h };
  }, [originNode, targetNode]);

  return (
    <div className="card border border-emerald-500/30 bg-black/60 backdrop-blur-md p-4 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-surface-light/40">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            {isSw ? 'DIBAJI YA MWELEKEO WA REBUILD' : 'REBUILD COMPASS NAV'}
          </span>
        </div>
        <div className="text-xs font-mono text-muted">
          {targetNode ? `${bearing}° ${heading}` : 'STANDBY'}
        </div>
      </div>

      <div className="flex items-center gap-5 my-4">
        {/* Animated Compass Dial */}
        <div className="relative w-24 h-24 rounded-full border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-black flex items-center justify-center shadow-inner">
          {/* Degree ticks */}
          <div className="absolute inset-1 rounded-full border border-dashed border-emerald-500/20" />
          <span className="absolute top-1 text-[9px] font-mono text-emerald-400 font-bold">N</span>
          <span className="absolute right-1 text-[9px] font-mono text-muted">E</span>
          <span className="absolute bottom-1 text-[9px] font-mono text-muted">S</span>
          <span className="absolute left-1 text-[9px] font-mono text-muted">W</span>

          {/* Needle */}
          <motion.div
            className="w-1 h-16 origin-center flex flex-col justify-between items-center"
            animate={{ rotate: bearing }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          >
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[18px] border-b-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[14px] border-t-red-500/60" />
          </motion.div>

          {/* Center pivot */}
          <div className="absolute w-2 h-2 rounded-full bg-emerald-300 ring-2 ring-emerald-950" />
        </div>

        {/* Telemetry Details */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-muted uppercase font-mono tracking-wider">
            {isSw ? 'Kituo cha Asili' : 'Current Outpost'}
          </div>
          <div className="text-sm font-semibold text-white truncate flex items-center gap-1.5 mt-0.5">
            <span>{originNode.icon}</span>
            <span className="truncate">{isSw && originNode.titleSw ? originNode.titleSw : originNode.title}</span>
          </div>

          <div className="mt-2.5">
            <div className="text-[11px] text-muted uppercase font-mono tracking-wider">
              {isSw ? 'Lengo la Urejeshaji' : 'Restoration Target'}
            </div>
            {targetNode ? (
              <div className="text-sm font-semibold text-emerald-300 truncate flex items-center gap-1.5 mt-0.5">
                <span>{targetNode.icon}</span>
                <span className="truncate">{isSw && targetNode.titleSw ? targetNode.titleSw : targetNode.title}</span>
              </div>
            ) : (
              <div className="text-xs text-muted/70 italic mt-0.5">
                {isSw ? 'Chagua nodi kwenye ramani' : 'Select a node on the grid'}
              </div>
            )}
          </div>

          {targetNode && (
            <div className="flex items-center gap-3 mt-2 font-mono text-[11px] text-emerald-400/90">
              <span className="flex items-center gap-1">
                <Navigation2 className="w-3 h-3 rotate-45" /> {distanceKm} km
              </span>
              <span>•</span>
              <span className="uppercase">{targetNode.region || 'Territory'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Target Quick Pick Bar */}
      {availableNodes.length > 0 && (
        <div className="mt-2 pt-2 border-t border-surface-light/30">
          <div className="text-[10px] uppercase font-mono text-muted mb-1.5">
            {isSw ? 'Miongozo ya Karibu:' : 'Radar Contacts:'}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {availableNodes.map((n) => {
              const active = targetNode?.id === n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    playRadarBeep();
                    onSelectTarget?.(n);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-mono shrink-0 transition-all border flex items-center gap-1 ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm'
                      : 'bg-surface-dark/40 text-muted border-surface-light/30 hover:border-surface-light'
                  }`}
                >
                  <span>{n.icon}</span>
                  <span className="max-w-[100px] truncate">{n.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
