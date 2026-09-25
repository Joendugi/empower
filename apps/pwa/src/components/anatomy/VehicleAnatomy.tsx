import { clsx } from 'clsx';

export type AnatomyKind = 'overview' | 'engine' | 'cooling' | 'drivetrain' | 'brakes' | 'electrical';

const labels: Record<AnatomyKind, Array<{ id: string; text: string; x: number; y: number }>> = {
  overview: [
    { id: 'body', text: 'Body / cabin', x: 52, y: 18 },
    { id: 'engine', text: 'Engine bay', x: 18, y: 38 },
    { id: 'cabin', text: 'Occupant cell', x: 48, y: 42 },
    { id: 'chassis', text: 'Chassis / rails', x: 50, y: 78 },
    { id: 'wheel', text: 'Unsprung corner', x: 84, y: 72 },
  ],
  engine: [
    { id: 'air', text: 'Intake / filter', x: 22, y: 16 },
    { id: 'head', text: 'Cylinder head', x: 48, y: 28 },
    { id: 'block', text: 'Block / pistons', x: 48, y: 52 },
    { id: 'crank', text: 'Crankshaft', x: 48, y: 76 },
    { id: 'exhaust', text: 'Exhaust / turbo', x: 80, y: 40 },
  ],
  cooling: [
    { id: 'rad', text: 'Radiator + fans', x: 16, y: 42 },
    { id: 'pump', text: 'Water pump', x: 42, y: 58 },
    { id: 'stat', text: 'Thermostat', x: 58, y: 28 },
    { id: 'jackets', text: 'Block jackets', x: 72, y: 52 },
    { id: 'tank', text: 'Expansion tank', x: 38, y: 14 },
  ],
  drivetrain: [
    { id: 'fly', text: 'Flywheel / clutch or converter', x: 22, y: 48 },
    { id: 'gear', text: 'Gearbox', x: 42, y: 40 },
    { id: 'shaft', text: 'Prop / driveshafts', x: 62, y: 48 },
    { id: 'diff', text: 'Differential', x: 82, y: 58 },
  ],
  brakes: [
    { id: 'pedal', text: 'Pedal + booster', x: 18, y: 28 },
    { id: 'master', text: 'Master cylinder', x: 36, y: 20 },
    { id: 'lines', text: 'Lines / ABS', x: 52, y: 40 },
    { id: 'caliper', text: 'Caliper + disc', x: 80, y: 62 },
    { id: 'susp', text: 'Spring / damper', x: 78, y: 28 },
  ],
  electrical: [
    { id: 'batt', text: 'Battery', x: 16, y: 62 },
    { id: 'alt', text: 'Alternator', x: 38, y: 34 },
    { id: 'start', text: 'Starter', x: 42, y: 68 },
    { id: 'fuse', text: 'Fuse / ECU', x: 68, y: 24 },
    { id: 'lamp', text: 'Lamps / loads', x: 84, y: 48 },
  ],
};

export default function VehicleAnatomy({
  kind,
  className,
  labeled = true,
}: {
  kind: AnatomyKind;
  className?: string;
  labeled?: boolean;
}) {
  return (
    <div className={clsx('relative w-full overflow-hidden rounded-2xl border border-surface-light bg-[#0b1220]', className)}>
      <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label={`Vehicle anatomy: ${kind}`}>
        <defs>
          <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
        </defs>
        <rect width="640" height="280" fill="#0b1220" />
        {kind === 'overview' && (
          <g>
            <path d="M70 170 L120 120 L250 95 L430 95 L540 130 L580 170 L580 190 L70 190 Z" fill="url(#metal)" opacity="0.35" />
            <rect x="70" y="188" width="510" height="14" rx="4" fill="#1e293b" />
            <circle cx="150" cy="210" r="28" fill="#0f172a" stroke="#64748b" />
            <circle cx="500" cy="210" r="28" fill="#0f172a" stroke="#64748b" />
            <rect x="200" y="108" width="200" height="70" rx="10" fill="#122033" stroke="#2dd4bf" />
            <rect x="80" y="128" width="100" height="52" rx="8" fill="#134e4a" />
          </g>
        )}
        {kind === 'engine' && (
          <g>
            <rect x="170" y="70" width="220" height="70" rx="8" fill="#1e293b" stroke="#94a3b8" />
            <rect x="180" y="145" width="200" height="80" rx="8" fill="#334155" />
            <rect x="210" y="228" width="140" height="16" rx="4" fill="#0f766e" />
            <path d="M120 90 L170 100 L170 130 L120 150 Z" fill="#155e75" />
            <path d="M390 90 L480 70 L500 160 L390 140 Z" fill="#7c2d12" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={198 + i * 42} y="88" width="28" height="40" rx="3" fill="#0f172a" stroke="#2dd4bf" />
            ))}
          </g>
        )}
        {kind === 'cooling' && (
          <g>
            <rect x="40" y="70" width="70" height="140" rx="6" fill="#155e75" stroke="#5eead4" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1="48" x2="102" y1={90 + i * 18} y2={90 + i * 18} stroke="#99f6e4" strokeWidth="2" />
            ))}
            <rect x="130" y="40" width="50" height="36" rx="6" fill="#0f766e" />
            <path d="M110 110 C180 90, 240 70, 320 90 C380 105, 430 140, 480 150" fill="none" stroke="#2dd4bf" strokeWidth="8" />
            <rect x="300" y="120" width="160" height="90" rx="10" fill="#1e293b" />
            <circle cx="250" cy="160" r="18" fill="#134e4a" stroke="#5eead4" />
          </g>
        )}
        {kind === 'drivetrain' && (
          <g>
            <rect x="60" y="110" width="70" height="70" rx="8" fill="#334155" />
            <rect x="140" y="100" width="120" height="80" rx="10" fill="#1e293b" stroke="#2dd4bf" />
            <rect x="270" y="128" width="180" height="16" rx="4" fill="#64748b" />
            <circle cx="500" cy="160" r="36" fill="#0f172a" stroke="#94a3b8" />
            <circle cx="500" cy="160" r="12" fill="#2dd4bf" />
          </g>
        )}
        {kind === 'brakes' && (
          <g>
            <rect x="50" y="40" width="90" height="50" rx="8" fill="#1e293b" />
            <rect x="160" y="48" width="70" height="28" rx="6" fill="#134e4a" />
            <path d="M230 62 H430" stroke="#94a3b8" strokeWidth="6" />
            <circle cx="500" cy="170" r="48" fill="#0f172a" stroke="#cbd5e1" strokeWidth="10" />
            <rect x="470" y="150" width="36" height="40" rx="4" fill="#0f766e" />
            <rect x="480" y="40" width="18" height="80" rx="4" fill="#64748b" />
          </g>
        )}
        {kind === 'electrical' && (
          <g>
            <rect x="40" y="150" width="70" height="50" rx="6" fill="#365314" stroke="#a3e635" />
            <circle cx="200" cy="90" r="28" fill="#1e293b" stroke="#fbbf24" />
            <rect x="180" y="170" width="70" height="32" rx="6" fill="#7c2d12" />
            <rect x="360" y="40" width="90" height="50" rx="8" fill="#1e293b" stroke="#2dd4bf" />
            <path d="M110 160 L180 100 L360 70 L520 120 L540 160" fill="none" stroke="#fbbf24" strokeWidth="3" />
            <rect x="520" y="140" width="50" height="24" rx="4" fill="#fef08a" />
          </g>
        )}
      </svg>
      {labeled &&
        labels[kind].map((label) => (
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
