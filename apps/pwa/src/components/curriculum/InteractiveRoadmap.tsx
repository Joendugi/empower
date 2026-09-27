import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { 
  Check, 
  Lock, 
  Play, 
  Trophy, 
  Sparkles, 
  Clock, 
  X,
  Award
} from 'lucide-react';
import type { Lesson, SkillPath } from '@cyberlearn/types';
import { getLesson } from '@/content';
import { outlineItems } from '@/lib/curriculumDraft';
import { useT } from '@/i18n';

export interface InteractiveRoadmapProps {
  path: SkillPath;
  lessons?: Record<string, Lesson>;
  completedLessonIds?: string[];
  onOpenLesson: (lessonId: string) => void;
}

export default function InteractiveRoadmap({
  path,
  lessons,
  completedLessonIds = [],
  onOpenLesson,
}: InteractiveRoadmapProps) {
  const t = useT();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const resolve = (id?: string) => (id ? lessons?.[id] ?? getLesson(id) : undefined);

  // Sinuous horizontal offset pattern for nodes (percentage across width)
  const nodeOffsets = [50, 28, 50, 72, 50, 25, 50, 75, 50, 30, 50, 70];

  // Calculate nodes with status
  const nodes = path.nodes.map((node, index) => {
    const lessonId = node.lessonIds[0];
    const lesson = resolve(lessonId);
    const done = lessonId ? completedLessonIds.includes(lessonId) : false;

    const prereqMet = (node.prerequisites ?? []).every((id) => {
      const required = path.nodes.find((item) => item.id === id);
      if (!required?.lessonIds.length) return true;
      return required.lessonIds.every((id) => completedLessonIds.includes(id));
    });
    const locked = Boolean(node.prerequisites?.length) && !prereqMet;
    const isMilestone = index === path.nodes.length - 1 || (index + 1) % 4 === 0;

    return {
      node,
      lesson,
      lessonId,
      done,
      locked,
      isMilestone,
      index,
      xPercent: nodeOffsets[index % nodeOffsets.length],
    };
  });

  // Find the first unlocked, non-completed node as active
  const activeNodeIndex = nodes.findIndex((n) => !n.done && !n.locked);
  const selected = nodes.find((n) => n.node.id === selectedNodeId);

  return (
    <div className="relative w-full max-w-xl mx-auto py-8 px-4 flex flex-col items-center select-none">
      {/* Curved SVG connector tracks */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{ minHeight: `${nodes.length * 130 + 100}px` }}
      >
        <defs>
          <linearGradient id="activeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e85d04" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#c2410c" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {nodes.map((n, i) => {
          if (i >= nodes.length - 1) return null;
          const next = nodes[i + 1];
          const y1 = i * 130 + 55;
          const y2 = (i + 1) * 130 + 55;
          const x1Pct = n.xPercent;
          const x2Pct = next.xPercent;

          const isCompletedSegment = n.done;

          return (
            <g key={`path-${i}`}>
              <path
                d={`M ${x1Pct}% ${y1} C ${x1Pct}% ${(y1 + y2) / 2}, ${x2Pct}% ${(y1 + y2) / 2}, ${x2Pct}% ${y2}`}
                fill="none"
                stroke={isCompletedSegment ? 'url(#activeGrad)' : 'rgba(255,255,255,0.08)'}
                strokeWidth={isCompletedSegment ? 4 : 3}
                strokeDasharray={isCompletedSegment ? undefined : '6,6'}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>

      {/* Nodes Column */}
      <div className="w-full space-y-[45px] relative z-10">
        {nodes.map((item, idx) => {
          const isActive = idx === activeNodeIndex;
          const isSelected = item.node.id === selectedNodeId;
          const week = item.node.weekNumber ?? idx + 1;

          return (
            <div
              key={item.node.id}
              className="flex justify-center items-center w-full relative"
              style={{
                transform: `translateX(${(item.xPercent - 50) * 2.8}px)`,
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Floating "Current" badge on active node */}
                {isActive && (
                  <motion.div
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.2 }}
                    className="absolute -top-7 px-2.5 py-0.5 rounded-md bg-accent text-white text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1 z-20"
                  >
                    <Sparkles className="w-3 h-3" />
                    START
                  </motion.div>
                )}

                {/* Main Node Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: item.locked ? 1 : 1.1 }}
                  whileTap={{ scale: item.locked ? 1 : 0.95 }}
                  onClick={() => {
                    if (!item.locked) {
                      setSelectedNodeId(item.node.id);
                    }
                  }}
                  disabled={item.locked}
                  className={clsx(
                    'relative flex items-center justify-center rounded-md transition-colors duration-150 font-semibold',
                    item.isMilestone ? 'w-20 h-20' : 'w-16 h-16',
                    item.done
                      ? 'bg-accent text-white border border-accent'
                      : isActive
                        ? 'bg-surface text-accent border-2 border-accent'
                        : item.locked
                          ? 'bg-surface-light/60 text-muted/50 border border-white/[0.05] cursor-not-allowed'
                          : 'bg-surface-light text-white border border-white/[0.15] hover:border-accent/50',
                    isSelected && 'ring-4 ring-accent/40'
                  )}
                  title={item.lesson?.title ?? item.node.title}
                >
                  {item.done ? (
                    <Check className={clsx(item.isMilestone ? 'w-9 h-9' : 'w-7 h-7', 'stroke-[3]')} />
                  ) : item.locked ? (
                    <Lock className="w-6 h-6 text-muted/40" />
                  ) : item.isMilestone ? (
                    <Trophy className="w-8 h-8 text-yellow-400 animate-bounce-once" />
                  ) : isActive ? (
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  ) : (
                    <span className="text-sm font-semibold">{week}</span>
                  )}

                  {/* Level / Check Indicator Pill */}
                  <span
                    className={clsx(
                      'absolute -bottom-2 px-2 py-0.2 rounded-full text-[9px] font-bold font-mono border',
                      item.done
                        ? 'bg-emerald-500 text-black border-emerald-300'
                        : item.locked
                          ? 'bg-surface text-muted/60 border-white/[0.05]'
                          : 'bg-surface text-accent border-accent/40'
                    )}
                  >
                    W{week}
                  </span>
                </motion.button>

                {/* Node Title Subtext */}
                <div className="text-center mt-2.5 max-w-[140px]">
                  <p
                    className={clsx(
                      'text-xs font-semibold truncate leading-tight transition-colors',
                      item.done
                        ? 'text-white'
                        : isActive
                          ? 'text-accent font-bold'
                          : item.locked
                            ? 'text-muted/50'
                            : 'text-muted-light'
                    )}
                  >
                    {item.lesson?.title ?? item.node.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-Up Inspector Drawer for Selected Node */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-20 inset-x-4 max-w-lg mx-auto z-40"
          >
            <div className="bg-surface rounded-lg !p-6 border border-white/[0.1]">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="badge-accent text-[10px] uppercase font-mono tracking-wider">
                    {t('weekLabel')} {selected.node.weekNumber ?? selected.index + 1}
                  </span>
                  <h3 className="font-semibold text-lg text-white mt-1">
                    {selected.lesson?.title ?? selected.node.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1.5 rounded-full text-muted hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-3 space-y-2 text-xs text-muted-light">
                {selected.lesson?.estimatedMinutes && (
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    {selected.lesson.estimatedMinutes} {t('minutes')} practical workshop study
                  </p>
                )}

                {outlineItems(selected.node.outline ?? selected.lesson?.outline ?? '').length > 0 && (
                  <ul className="space-y-1 pt-1 text-[11px] text-muted">
                    {outlineItems(selected.node.outline ?? selected.lesson?.outline ?? '')
                      .slice(0, 3)
                      .map((item) => (
                        <li key={item} className="truncate">• {item}</li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="pt-2 flex gap-2.5">
                {selected.lessonId && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selected.lessonId) {
                        onOpenLesson(selected.lessonId);
                        setSelectedNodeId(null);
                      }
                    }}
                    className="btn-primary w-full text-xs py-3 font-bold"
                  >
                    {selected.done ? (
                      <>
                        <Award className="w-4 h-4" /> Review Completed Lesson
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" /> Start Lesson
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
