import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLearnerStore } from '@/store/learnerStore';

interface StoryEpisodeProps {
  episodeId: string;
  onComplete: () => void;
  onSkip: () => void;
}

interface Episode {
  title: string;
  titleSw: string;
  panels: Array<{
    icon: string;
    text: string;
    textSw: string;
  }>;
}

const EPISODES: Record<string, Episode> = {
  'ep-0-the-blackout': {
    title: 'Episode 0 — The Blackout',
    titleSw: 'Kipindi 0 — Giza Kuu',
    panels: [
      {
        icon: '🌍',
        text: 'It started quietly. An anomaly in a routing table. A single mis-configured BGP advertisement that spread like fire.',
        textSw: 'Ilianza kimya. Hitilafu katika jedwali la njia. Tangazo moja baya la BGP lililosambaa kama moto.',
      },
      {
        icon: '⚡',
        text: 'Within six hours, power grids across three nations began to fail. The cascading effect no one had planned for.',
        textSw: 'Ndani ya saa sita, gridi za umeme katika mataifa matatu zilianza kushindwa. Athari ya mfululizo ambayo hakuna aliyepanga.',
      },
      {
        icon: '🏥',
        text: 'Hospitals switched to paper. Banks froze. Mobile money stopped. 47 million people lost access to their savings in one afternoon.',
        textSw: 'Hospitali zilirudi kwenye karatasi. Benki zalisimama. Pesa za simu zikaacha. Watu milioni 47 walipoteza akiba yao mchana mmoja.',
      },
      {
        icon: '📡',
        text: 'The Rebuilder Corps was formed in the ruins. Not governments. Not corporations. Engineers, students, and technicians who refused to give up.',
        textSw: 'Jeshi la Wajenzi liliundwa kwenye magofu. Si serikali. Si makampuni. Wahandisi, wanafunzi, na mafundi waliokataa kukata tamaa.',
      },
      {
        icon: '🔐',
        text: 'That was 2031. Now it is your turn. Every skill you learn is a node restored. Every lesson is a line of defence against The Next Blackout.',
        textSw: 'Hiyo ilikuwa 2031. Sasa ni zamu yako. Kila ujuzi unaoujifunza ni nodi iliyorejeshwa. Kila somo ni mstari wa ulinzi dhidi ya Giza lijalo.',
      },
    ],
  },
  'ep-1-first-signal': {
    title: 'Episode 1 — First Signal',
    titleSw: 'Kipindi 1 — Ishara ya Kwanza',
    panels: [
      {
        icon: '📡',
        text: 'You have restored the Nairobi Communications Tower. For the first time in months, the signal reaches Mombasa.',
        textSw: 'Umeurejesha Mnara wa Mawasiliano wa Nairobi. Kwa mara ya kwanza kwa miezi mingi, ishara inafika Mombasa.',
      },
      {
        icon: '💬',
        text: 'A message comes through: "We hear you. Mombasa Corps is operational. 12 technicians. Partial power. We need network support."',
        textSw: 'Ujumbe unafika: "Tunakusikia. Jeshi la Mombasa linafanya kazi. Mafundi 12. Umeme wa sehemu. Tunahitaji msaada wa mtandao."',
      },
      {
        icon: '🤝',
        text: 'The Rebuild is not a solo mission. Every node you restore connects you to another team, another city, another hope.',
        textSw: 'Ujenzi upya si safari ya peke yako. Kila nodi unayoirejesha inakuunganisha na timu nyingine, mji mwingine, tumaini jingine.',
      },
      {
        icon: '🌐',
        text: 'Network Fundamentals: complete. The map grows brighter.',
        textSw: 'Misingi ya Mtandao: imekamilika. Ramani inang\'aa zaidi.',
      },
    ],
  },
};

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export default function StoryEpisode({ episodeId, onComplete, onSkip }: StoryEpisodeProps) {
  const language = useLearnerStore((s) => s.language);
  const [panelIndex, setPanelIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const episode = EPISODES[episodeId];

  if (!episode) {
    return (
      <div className="min-h-dvh bg-primary-dark flex items-center justify-center text-muted text-sm">
        Episode not found.
      </div>
    );
  }

  const panels = episode.panels;
  const isLast = panelIndex === panels.length - 1;
  const panel = panels[panelIndex];

  const goNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setDirection(1);
      setPanelIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (panelIndex === 0) return;
    setDirection(-1);
    setPanelIndex((i) => i - 1);
  };

  const title = language === 'sw' ? episode.titleSw : episode.title;

  return (
    <div className="min-h-dvh bg-primary-dark flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">{title}</span>
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-muted hover:text-white transition-colors uppercase tracking-wider font-medium"
        >
          Skip
        </button>
      </div>

      {/* Panel area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={panelIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <span className="text-6xl mb-8 leading-none" role="img" aria-hidden>
              {panel.icon}
            </span>
            <p className="text-white/90 leading-relaxed text-lg">
              {language === 'sw' ? panel.textSw : panel.text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom: progress dots + navigation */}
      <div className="flex flex-col items-center gap-5 px-6 pb-10">
        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {panels.map((_, idx) => (
            <div
              key={idx}
              className={`rounded-full transition-all duration-300 ${
                idx === panelIndex
                  ? 'w-4 h-2 bg-accent'
                  : idx < panelIndex
                    ? 'w-2 h-2 bg-accent/60'
                    : 'w-2 h-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Nav buttons */}
        <div className="flex gap-3 w-full max-w-xs">
          {panelIndex > 0 && (
            <button
              type="button"
              className="btn-secondary flex-1 py-3 text-sm"
              onClick={goPrev}
            >
              ← Back
            </button>
          )}
          <button
            type="button"
            className="btn-primary flex-1 py-3 text-sm"
            onClick={goNext}
          >
            {isLast ? 'Continue →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
