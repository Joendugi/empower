import { clsx } from 'clsx';

export type TradeKit =
  | 'sewing'
  | 'welding'
  | 'electrical'
  | 'plumbing'
  | 'masonry'
  | 'carpentry'
  | 'garage'
  | 'salon'
  | 'kitchen'
  | 'farm'
  | 'solar'
  | 'care'
  | 'waste'
  | 'wash'
  | 'shop'
  | 'workshop';

const labels: Record<TradeKit, Array<{ id: string; text: string; x: number; y: number }>> = {
  sewing: [
    { id: 'head', text: 'Machine head', x: 38, y: 28 },
    { id: 'needle', text: 'Needle / presser', x: 58, y: 42 },
    { id: 'feed', text: 'Feed / throat plate', x: 62, y: 68 },
    { id: 'treadle', text: 'Treadle / motor', x: 28, y: 78 },
  ],
  welding: [
    { id: 'helmet', text: 'Helmet / shade', x: 18, y: 22 },
    { id: 'torch', text: 'Torch / electrode', x: 42, y: 40 },
    { id: 'work', text: 'Workpiece + earth', x: 62, y: 62 },
    { id: 'gas', text: 'Gas / machine', x: 84, y: 28 },
  ],
  electrical: [
    { id: 'cu', text: 'Consumer unit', x: 18, y: 30 },
    { id: 'circuit', text: 'Circuit / MCB', x: 42, y: 44 },
    { id: 'earth', text: 'Earth / bonding', x: 38, y: 74 },
    { id: 'load', text: 'Outlet / load', x: 78, y: 52 },
  ],
  plumbing: [
    { id: 'supply', text: 'Supply / isolation', x: 18, y: 28 },
    { id: 'fixture', text: 'Fixture', x: 48, y: 22 },
    { id: 'trap', text: 'Trap / waste', x: 52, y: 68 },
    { id: 'vent', text: 'Vent / stack', x: 82, y: 30 },
  ],
  masonry: [
    { id: 'found', text: 'Foundation', x: 30, y: 78 },
    { id: 'bond', text: 'Bond / course', x: 48, y: 48 },
    { id: 'lintel', text: 'Lintel / opening', x: 70, y: 32 },
    { id: 'plumb', text: 'Plumb / line', x: 18, y: 40 },
  ],
  carpentry: [
    { id: 'stock', text: 'Squared stock', x: 28, y: 40 },
    { id: 'joint', text: 'Joint / shoulder', x: 52, y: 48 },
    { id: 'square', text: 'Try square', x: 78, y: 28 },
    { id: 'fix', text: 'Fastener / glue', x: 70, y: 72 },
  ],
  garage: [
    { id: 'lift', text: 'Stand / lift point', x: 22, y: 70 },
    { id: 'bay', text: 'Service bay', x: 48, y: 42 },
    { id: 'wheel', text: 'Corner / wheel', x: 80, y: 68 },
    { id: 'bench', text: 'Tools / fluids', x: 78, y: 22 },
  ],
  salon: [
    { id: 'chair', text: 'Client chair', x: 38, y: 58 },
    { id: 'wash', text: 'Basin / wash', x: 18, y: 30 },
    { id: 'tools', text: 'Sterile tools', x: 78, y: 28 },
    { id: 'gown', text: 'Cape / PPE', x: 68, y: 70 },
  ],
  kitchen: [
    { id: 'prep', text: 'Prep / raw', x: 20, y: 36 },
    { id: 'cook', text: 'Heat / cook', x: 48, y: 30 },
    { id: 'cold', text: 'Cold hold', x: 78, y: 36 },
    { id: 'wash', text: 'Wash / waste', x: 50, y: 74 },
  ],
  farm: [
    { id: 'soil', text: 'Soil / bed', x: 28, y: 72 },
    { id: 'water', text: 'Water / irrigate', x: 22, y: 30 },
    { id: 'crop', text: 'Crop / plant', x: 55, y: 40 },
    { id: 'tool', text: 'Tool / store', x: 82, y: 28 },
  ],
  solar: [
    { id: 'pv', text: 'PV array', x: 22, y: 28 },
    { id: 'cc', text: 'Controller', x: 48, y: 48 },
    { id: 'batt', text: 'Battery bank', x: 48, y: 74 },
    { id: 'inv', text: 'Inverter / load', x: 80, y: 40 },
  ],
  care: [
    { id: 'person', text: 'Person / consent', x: 32, y: 40 },
    { id: 'ppe', text: 'PPE / hygiene', x: 70, y: 24 },
    { id: 'plan', text: 'Care plan', x: 78, y: 58 },
    { id: 'note', text: 'Record / escalate', x: 50, y: 78 },
  ],
  waste: [
    { id: 'sort', text: 'Sort at source', x: 22, y: 36 },
    { id: 'wet', text: 'Wet / organic', x: 48, y: 30 },
    { id: 'dry', text: 'Dry recyclable', x: 74, y: 36 },
    { id: 'ppe', text: 'PPE / wash', x: 50, y: 74 },
  ],
  wash: [
    { id: 'source', text: 'Source', x: 16, y: 36 },
    { id: 'treat', text: 'Treat / store', x: 42, y: 28 },
    { id: 'point', text: 'Use point', x: 70, y: 36 },
    { id: 'grey', text: 'Grey / drain', x: 52, y: 74 },
  ],
  shop: [
    { id: 'stock', text: 'Stock / cost', x: 22, y: 36 },
    { id: 'till', text: 'Cash / M-Pesa', x: 50, y: 28 },
    { id: 'book', text: 'Books / receipt', x: 78, y: 40 },
    { id: 'client', text: 'Customer', x: 50, y: 74 },
  ],
  workshop: [
    { id: 'bench', text: 'Bench / vice', x: 30, y: 48 },
    { id: 'ppe', text: 'PPE station', x: 18, y: 22 },
    { id: 'store', text: 'Tool store', x: 78, y: 28 },
    { id: 'waste', text: 'Waste / isolate', x: 72, y: 72 },
  ],
};

function Drawing({ kit }: { kit: TradeKit }) {
  if (kit === 'sewing') {
    return (
      <g>
        <rect x="120" y="70" width="220" height="90" rx="10" fill="#1e293b" stroke="#2dd4bf" />
        <rect x="280" y="95" width="70" height="18" fill="#134e4a" />
        <rect x="330" y="88" width="8" height="40" fill="#94a3b8" />
        <rect x="140" y="180" width="160" height="14" rx="3" fill="#334155" />
        <path d="M160 220 L200 250 L280 250 L320 220" fill="#0f172a" stroke="#64748b" />
      </g>
    );
  }
  if (kit === 'welding') {
    return (
      <g>
        <path d="M80 60 L140 40 L160 90 L100 110 Z" fill="#1e293b" stroke="#fbbf24" />
        <path d="M200 90 L320 150" stroke="#f97316" strokeWidth="8" />
        <rect x="300" y="150" width="160" height="50" rx="6" fill="#334155" />
        <circle cx="520" cy="80" r="28" fill="#7c2d12" stroke="#fdba74" />
      </g>
    );
  }
  if (kit === 'electrical') {
    return (
      <g>
        <rect x="50" y="50" width="90" height="130" rx="8" fill="#1e293b" stroke="#fbbf24" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="62" y={68 + i * 26} width="66" height="16" rx="3" fill="#134e4a" />
        ))}
        <path d="M140 90 H420" stroke="#facc15" strokeWidth="4" />
        <rect x="430" y="110" width="80" height="50" rx="8" fill="#0f172a" stroke="#2dd4bf" />
        <path d="M90 200 L90 230 L200 230" stroke="#22c55e" strokeWidth="4" />
      </g>
    );
  }
  if (kit === 'plumbing') {
    return (
      <g>
        <rect x="250" y="40" width="90" height="70" rx="10" fill="#1e293b" />
        <path d="M80 80 H250" stroke="#38bdf8" strokeWidth="10" />
        <path d="M295 110 V160 C295 190 240 190 240 160 V150" fill="none" stroke="#64748b" strokeWidth="10" />
        <rect x="480" y="40" width="18" height="150" fill="#475569" />
      </g>
    );
  }
  if (kit === 'masonry') {
    return (
      <g>
        <rect x="80" y="200" width="460" height="24" fill="#78350f" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3, 4].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={100 + col * 80 + (row % 2) * 40}
              y={80 + row * 36}
              width="72"
              height="30"
              fill="#9a3412"
              stroke="#fed7aa"
            />
          ))
        )}
        <rect x="380" y="70" width="120" height="16" fill="#94a3b8" />
      </g>
    );
  }
  if (kit === 'carpentry') {
    return (
      <g>
        <rect x="90" y="90" width="260" height="36" fill="#92400e" />
        <rect x="300" y="90" width="36" height="120" fill="#b45309" />
        <path d="M460 50 L500 50 L500 160" fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle cx="430" cy="200" r="10" fill="#94a3b8" />
      </g>
    );
  }
  if (kit === 'garage') {
    return (
      <g>
        <rect x="90" y="120" width="420" height="50" rx="12" fill="#334155" />
        <circle cx="170" cy="200" r="26" fill="#0f172a" stroke="#94a3b8" />
        <circle cx="430" cy="200" r="26" fill="#0f172a" stroke="#94a3b8" />
        <rect x="70" y="200" width="40" height="18" fill="#134e4a" />
        <rect x="480" y="40" width="80" height="50" rx="8" fill="#1e293b" />
      </g>
    );
  }
  if (kit === 'salon') {
    return (
      <g>
        <circle cx="230" cy="90" r="28" fill="#fda4af" />
        <rect x="190" y="120" width="80" height="90" rx="16" fill="#1e293b" />
        <rect x="60" y="50" width="70" height="40" rx="20" fill="#155e75" />
        <rect x="470" y="50" width="90" height="50" rx="8" fill="#334155" />
      </g>
    );
  }
  if (kit === 'kitchen') {
    return (
      <g>
        <rect x="50" y="70" width="120" height="70" rx="8" fill="#1e293b" />
        <rect x="220" y="50" width="160" height="80" rx="8" fill="#7c2d12" />
        <rect x="430" y="70" width="120" height="70" rx="8" fill="#155e75" />
        <rect x="220" y="180" width="160" height="40" rx="8" fill="#334155" />
      </g>
    );
  }
  if (kit === 'farm') {
    return (
      <g>
        <rect x="40" y="190" width="560" height="30" fill="#365314" />
        <path d="M80 80 Q120 40 160 80" fill="none" stroke="#38bdf8" strokeWidth="6" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={200 + i * 40} y="120" width="10" height="70" fill="#16a34a" />
        ))}
        <rect x="500" y="50" width="70" height="50" rx="8" fill="#1e293b" />
      </g>
    );
  }
  if (kit === 'solar') {
    return (
      <g>
        <rect x="50" y="40" width="140" height="90" rx="6" fill="#1e3a5f" stroke="#38bdf8" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="60" x2="180" y1={60 + i * 22} y2={60 + i * 22} stroke="#7dd3fc" />
        ))}
        <rect x="260" y="110" width="90" height="40" rx="6" fill="#134e4a" />
        <rect x="260" y="180" width="90" height="40" rx="6" fill="#365314" />
        <rect x="460" y="90" width="90" height="60" rx="8" fill="#1e293b" stroke="#fbbf24" />
      </g>
    );
  }
  if (kit === 'care') {
    return (
      <g>
        <circle cx="200" cy="90" r="30" fill="#fda4af" />
        <rect x="165" y="125" width="70" height="80" rx="16" fill="#1e293b" />
        <rect x="400" y="40" width="90" height="50" rx="8" fill="#155e75" />
        <rect x="430" y="130" width="110" height="60" rx="8" fill="#334155" />
      </g>
    );
  }
  if (kit === 'waste') {
    return (
      <g>
        <rect x="70" y="70" width="90" height="110" rx="10" fill="#1e293b" />
        <rect x="220" y="70" width="90" height="110" rx="10" fill="#14532d" />
        <rect x="370" y="70" width="90" height="110" rx="10" fill="#1e3a8a" />
        <rect x="230" y="200" width="140" height="30" rx="8" fill="#334155" />
      </g>
    );
  }
  if (kit === 'wash') {
    return (
      <g>
        <ellipse cx="90" cy="90" rx="40" ry="24" fill="#0e7490" />
        <rect x="200" y="50" width="90" height="80" rx="8" fill="#155e75" />
        <rect x="380" y="70" width="70" height="50" rx="8" fill="#1e293b" />
        <path d="M250 140 C250 190 320 200 360 190" fill="none" stroke="#64748b" strokeWidth="8" />
      </g>
    );
  }
  if (kit === 'shop') {
    return (
      <g>
        <rect x="60" y="70" width="120" height="90" rx="8" fill="#1e293b" />
        <rect x="240" y="50" width="130" height="70" rx="8" fill="#134e4a" />
        <rect x="440" y="70" width="110" height="80" rx="8" fill="#334155" />
        <circle cx="300" cy="200" r="24" fill="#fda4af" />
      </g>
    );
  }
  return (
    <g>
      <rect x="80" y="90" width="280" height="80" rx="8" fill="#1e293b" />
      <rect x="70" y="40" width="70" height="40" rx="8" fill="#134e4a" />
      <rect x="450" y="50" width="100" height="70" rx="8" fill="#334155" />
    </g>
  );
}

export default function TradeWorkshop({
  kit,
  className,
  labeled = true,
}: {
  kit: TradeKit;
  className?: string;
  labeled?: boolean;
}) {
  return (
    <div className={clsx('relative w-full overflow-hidden rounded-2xl border border-surface-light bg-[#0b1220]', className)}>
      <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label={`Trade workshop: ${kit}`}>
        <rect width="640" height="280" fill="#0b1220" />
        <Drawing kit={kit} />
      </svg>
      {labeled &&
        labels[kit].map((label) => (
          <span
            key={label.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-primary/90 border border-accent/40 text-white whitespace-nowrap"
            style={{ left: `${label.x}%`, top: `${label.y}%` }}
          >
            {label.text}
          </span>
        ))}
    </div>
  );
}
