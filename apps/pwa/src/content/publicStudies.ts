import type { AnatomyKind } from '@/components/anatomy/VehicleAnatomy';
import type { TradeKit } from '@/components/anatomy/TradeWorkshop';
import { tradeProgrammes } from '@/content/trades';
import type { TradeModule, TradeProgramme } from '@/content/trades/build';

export interface PublicStudy {
  slug: string;
  programmeId: string;
  programmeTitle: string;
  programmeIcon: string;
  title: string;
  kicker: string;
  minutes: number;
  summary: string;
  body: string;
  sources: string[];
  lessonPath: string;
  anatomyKind?: AnatomyKind;
  tradeKit: TradeKit;
}

const anatomyKinds: Record<string, AnatomyKind> = {
  overview: 'overview',
  engine: 'engine',
  cooling: 'cooling',
  drivetrain: 'drivetrain',
  brakes: 'brakes',
  electrical: 'electrical',
};

const kitByProgramme: Record<string, TradeKit> = {
  'sewing-garment': 'sewing',
  'welding-fabrication': 'welding',
  'electrical-installation': 'electrical',
  plumbing: 'plumbing',
  masonry: 'masonry',
  carpentry: 'carpentry',
  'vehicle-anatomy': 'garage',
  automotive: 'garage',
  'body-works': 'garage',
  refrigeration: 'garage',
  hairdressing: 'salon',
  hospitality: 'kitchen',
  agriculture: 'farm',
  'solar-energy': 'solar',
  'community-health-support': 'care',
  'caregiving-assistance': 'care',
  'waste-recycling': 'waste',
  'water-sanitation-hygiene': 'wash',
  'digital-enterprise': 'shop',
};

function sourcesFor(programme: TradeProgramme, mod: TradeModule) {
  return [
    programme.certificationTarget ?? `CDACC / NITA — ${programme.title}`,
    mod.cdacc ? `Unit ${mod.cdacc}` : 'Workshop / community practice notes',
    'Labeled like a trade anatomy study: parts, sequence, test, and stop points',
  ];
}

function toStudy(programme: TradeProgramme, mod: TradeModule): PublicStudy {
  return {
    slug: `${programme.id}-${mod.slug}`,
    programmeId: programme.id,
    programmeTitle: programme.title,
    programmeIcon: programme.icon,
    title: mod.title,
    kicker: programme.title,
    minutes: mod.minutes ?? 18,
    summary: mod.description,
    body: mod.briefing,
    sources: sourcesFor(programme, mod),
    lessonPath: `/learn/lesson/${programme.id}-${mod.slug}-lesson`,
    anatomyKind: programme.id === 'vehicle-anatomy' ? anatomyKinds[mod.slug] : undefined,
    tradeKit: kitByProgramme[programme.id] ?? 'workshop',
  };
}

export const publicStudies: PublicStudy[] = tradeProgrammes.flatMap((programme) =>
  programme.modules.map((mod) => toStudy(programme, mod))
);

export const publicProgrammes = tradeProgrammes.map((programme) => ({
  id: programme.id,
  title: programme.title,
  icon: programme.icon,
  description: programme.description,
  count: programme.modules.length,
}));

const legacyAnatomy = new Map(
  ['overview', 'engine', 'cooling', 'drivetrain', 'brakes', 'electrical'].map((slug) => [
    slug,
    `vehicle-anatomy-${slug}`,
  ])
);

export function getPublicStudy(slug: string) {
  const resolved = legacyAnatomy.get(slug) ?? slug;
  return publicStudies.find((study) => study.slug === resolved);
}
