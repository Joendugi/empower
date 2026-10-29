import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Activity, ChevronRight } from 'lucide-react';
import type { CivilizationNode, CompassSector } from '@cyberlearn/types';
import { CIVILIZATION_NODES } from './civilizationData';
import { NarrativeCompass } from './NarrativeCompass';

interface CivilizationMapViewProps {
  completedLessonIds?: string[];
  onOpenNode?: (node: CivilizationNode) => void;
  language?: string;
}

const SECTOR_COLORS: Record<CompassSector, { stroke: string; glow: string; text: string; label: string }> = {
  power: { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', text: 'text-amber-400', label: 'Power Layer' },
  comms: { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', text: 'text-emerald-400', label: 'Comms Mesh' },
  compute: { stroke: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', text: 'text-blue-400', label: 'Compute Cluster' },
  data: { stroke: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)', text: 'text-purple-400', label: 'Data Vault' },
  applications: { stroke: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)', text: 'text-pink-400', label: 'Civil App' },
};

export const CivilizationMapView: React.FC<CivilizationMapViewProps> = ({
  completedLessonIds = [],
  onOpenNode,
  language = 'en',
}) => {
  const isSw = language === 'sw';
  const [selectedNode, setSelectedNode] = useState<CivilizationNode>(CIVILIZATION_NODES[0]);
  const [targetNode, setTargetNode] = useState<CivilizationNode | null>(CIVILIZATION_NODES[1]);
  const [filterSector, setFilterSector] = useState<CompassSector | 'all'>('all');

  // Mark nodes restored if the user has completed lessons or mock for demonstration
  const nodes = CIVILIZATION_NODES.map((n) => ({
    ...n,
    isRestored: n.id === 'node-comms-nairobi' || completedLessonIds.length > 0,
  }));

  const restoredCount = nodes.filter((n) => n.isRestored).length;
  const restorationPercentage = Math.round((restoredCount / nodes.length) * 100);

  const filteredNodes = filterSector === 'all' ? nodes : nodes.filter((n) => n.sector === filterSector);

  return (
    <div className="space-y-6">
      {/* Top Banner / Civilization Status */}
      <div className="card bg-gradient-to-r from-emerald-950/40 via-surface-dark to-black border border-emerald-500/30 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            <Radio className="w-4 h-4 animate-pulse" />
            {isSw ? 'RAMANI YA MAENDELEO YA GIZA KUU' : 'CIVILIZATION GRID TELEMETRY'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {isSw ? 'Mtandao wa Ujenzi Mpya wa Afrika Mashariki' : 'East Africa Regional Restoration Grid'}
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl">
            {isSw
              ? 'Kila nodi inawakilisha mfumo wa miundombinu uliovunjwa na Giza Kuu la 2031. Kila somo unalokamilisha linawasha mawasiliano upya.'
              : 'Every node corresponds to a critical infrastructure junction. Restore connectivity across power, comms, and compute layers.'}
          </p>
        </div>

        {/* Progress Bar & Stat */}
        <div className="w-full md:w-64 bg-black/60 border border-surface-light/40 rounded-xl p-3 shrink-0">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-muted">{isSw ? 'Urejeshaji wa Kikanda' : 'Restoration Index'}</span>
            <span className="text-emerald-400 font-bold">{restorationPercentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-dark overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-300"
              initial={{ width: 0 }}
              animate={{ width: `${restorationPercentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="text-[11px] text-muted font-mono mt-1 text-right">
            {restoredCount} / {nodes.length} {isSw ? 'Nodi ziko mtandaoni' : 'Nodes Online'}
          </div>
        </div>
      </div>

      {/* Grid Canvas + Compass Nav Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Civilization Map (2 cols) */}
        <div className="lg:col-span-2 card bg-black/80 border border-surface-light/40 p-4 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col justify-between">
          {/* Sector Filters Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-surface-light/30 flex-wrap gap-2">
            <div className="text-xs font-mono uppercase text-muted tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-accent" />
              {isSw ? 'Safu za Miundombinu:' : 'Infrastructure Sectors:'}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'comms', 'power', 'compute', 'data', 'applications'] as const).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setFilterSector(sec)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all border ${
                    filterSector === sec
                      ? 'bg-accent/20 text-accent border-accent/60 font-bold'
                      : 'bg-surface-dark/40 text-muted border-surface-light/30 hover:border-surface-light'
                  }`}
                >
                  {sec.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Map Vector Stage */}
          <div className="relative w-full aspect-[4/3] bg-radial from-emerald-950/20 via-black to-black rounded-xl overflow-hidden mt-2 border border-surface-light/20 flex items-center justify-center">
            {/* Background Map Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>

            <svg viewBox="100 100 800 700" className="w-full h-full select-none">
              {/* Transmission Line Connections */}
              <g className="connections">
                {nodes.map((node) =>
                  (node.connections || []).map((connId) => {
                    const target = nodes.find((n) => n.id === connId);
                    if (!target || !node.x || !node.y || !target.x || !target.y) return null;
                    const bothRestored = node.isRestored && target.isRestored;
                    return (
                      <line
                        key={`${node.id}-${connId}`}
                        x1={node.x}
                        y1={node.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={bothRestored ? '#10b981' : '#334155'}
                        strokeWidth={bothRestored ? '2.5' : '1.5'}
                        strokeDasharray={bothRestored ? 'none' : '4,4'}
                        strokeOpacity={bothRestored ? 0.8 : 0.4}
                      />
                    );
                  })
                )}
              </g>

              {/* Bearing Line to Target */}
              {selectedNode.x && selectedNode.y && targetNode?.x && targetNode?.y && (
                <line
                  x1={selectedNode.x}
                  y1={selectedNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="#34d399"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
              )}

              {/* Node Hotspots */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isTarget = targetNode?.id === node.id;
                const sectorStyle = SECTOR_COLORS[node.sector];

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => {
                      setSelectedNode(node);
                      if (selectedNode.id !== node.id) {
                        setTargetNode(node);
                      }
                    }}
                  >
                    {/* Pulsing ring for online nodes */}
                    {node.isRestored && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="24"
                        fill="none"
                        stroke={sectorStyle.stroke}
                        strokeWidth="1.5"
                        opacity="0.4"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer selection ring */}
                    {(isSelected || isTarget) && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="22"
                        fill="none"
                        stroke={isTarget ? '#34d399' : '#f59e0b'}
                        strokeWidth="2"
                      />
                    )}

                    {/* Node Core Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="16"
                      fill={node.isRestored ? '#064e3b' : '#0f172a'}
                      stroke={sectorStyle.stroke}
                      strokeWidth="2"
                    />

                    {/* Emoji Label inside */}
                    <text
                      x={node.x}
                      y={(node.y || 0) + 5}
                      fontSize="14"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {node.icon}
                    </text>

                    {/* Node Title text below */}
                    <text
                      x={node.x}
                      y={(node.y || 0) + 28}
                      fontSize="10"
                      fill={node.isRestored ? '#ffffff' : '#94a3b8'}
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.title.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* In-canvas Map Legend */}
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md border border-surface-light/40 px-3 py-1.5 rounded-lg text-[10px] font-mono text-muted flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                {isSw ? 'Imerejeshwa' : 'Restored'}
              </span>
              <span className="flex items-center gap-1 text-muted">
                <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
                {isSw ? 'Giza Kuu (Nje)' : 'Dark Node'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Compass Mechanics & Selected Node Intel */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Narrative Compass */}
          <NarrativeCompass
            originNode={selectedNode}
            targetNode={targetNode}
            availableNodes={nodes.filter((n) => n.id !== selectedNode.id)}
            onSelectTarget={(node) => setTargetNode(node)}
            language={language}
          />

          {/* Node Dossier Card */}
          <div className="card bg-surface-dark border border-surface-light/40 p-4 rounded-2xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-light/30">
                <span className={`text-[11px] font-mono uppercase tracking-wider font-bold ${SECTOR_COLORS[selectedNode.sector].text}`}>
                  {SECTOR_COLORS[selectedNode.sector].label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-mono ${selectedNode.isRestored ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                  {selectedNode.isRestored ? 'ONLINE' : 'DARK'}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedNode.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {isSw && selectedNode.titleSw ? selectedNode.titleSw : selectedNode.title}
                    </h3>
                    <p className="text-xs font-mono text-muted">{selectedNode.region || 'East Africa Outpost'}</p>
                  </div>
                </div>

                <p className="text-xs text-muted/90 mt-2.5 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>
            </div>

            {/* Restoration Action CTA */}
            <div className="mt-4 pt-3 border-t border-surface-light/30">
              <button
                type="button"
                onClick={() => onOpenNode?.(selectedNode)}
                className="w-full btn-primary flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5"
              >
                <span>{selectedNode.isRestored ? (isSw ? 'Fungua Moduli ya Nodi' : 'Access Node Terminal') : (isSw ? 'Anzisha Operesheni ya Kurejesha' : 'Initiate Restoration Protocol')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
