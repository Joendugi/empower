import type { CivilizationNode, CompassHeading } from '@cyberlearn/types';

/**
 * 10 Canonical Infrastructure Nodes across East Africa
 * Representing the 5 layers: Power, Comms, Compute, Data, Applications
 */
export const CIVILIZATION_NODES: CivilizationNode[] = [
  {
    id: 'node-comms-nairobi',
    title: 'Nairobi Telecommunications Tower',
    titleSw: 'Mnara wa Mawasiliano wa Nairobi',
    description: 'Central regional microwave & fiber junction. Feeds emergency communications for Central Kenya.',
    icon: '🌐',
    sector: 'comms',
    isRestored: false,
    x: 500,
    y: 520,
    bearing: 0,
    region: 'Nairobi Central',
    regionSw: 'Katikati ya Nairobi',
    pathId: 'cybersecurity',
    connections: ['node-grid-olaria', 'node-hospital-nakuru', 'node-mesh-mombasa', 'node-data-vault'],
  },
  {
    id: 'node-grid-olaria',
    title: 'Olkaria Geothermal Power Grid',
    titleSw: 'Mtandao wa Umeme wa Jotoardhi wa Olkaria',
    description: 'Geothermal SCADA system controlling 60% of East Africa renewable baseload power.',
    icon: '⚡',
    sector: 'power',
    isRestored: false,
    x: 420,
    y: 480,
    bearing: 315,
    region: 'Rift Valley Basin',
    regionSw: 'Bonde la Ufa',
    pathId: 'solar-energy',
    connections: ['node-comms-nairobi', 'node-hospital-nakuru'],
  },
  {
    id: 'node-hospital-nakuru',
    title: 'Nakuru Trauma & Health Network',
    titleSw: 'Mtandao wa Afya na Jeraha wa Nakuru',
    description: 'Clinical health record system and ICU telemedicine telemetry spanning Western Kenya.',
    icon: '🏥',
    sector: 'applications',
    isRestored: false,
    x: 380,
    y: 410,
    bearing: 330,
    region: 'Nakuru County',
    regionSw: 'Kaunti ya Nakuru',
    pathId: 'the-rebuild-protocol',
    connections: ['node-grid-olaria', 'node-server-eldoret'],
  },
  {
    id: 'node-server-eldoret',
    title: 'Eldoret Linux Cluster & Seed Vault',
    titleSw: 'Kituo cha Kompyuta cha Linux cha Eldoret',
    description: 'Highlands edge compute and agricultural seed supply distribution node.',
    icon: '🖥️',
    sector: 'compute',
    isRestored: false,
    x: 320,
    y: 340,
    bearing: 310,
    region: 'North Rift',
    regionSw: 'Kaskazini mwa Bonde',
    pathId: 'cybersecurity',
    connections: ['node-hospital-nakuru', 'node-satellite-lodwar'],
  },
  {
    id: 'node-satellite-lodwar',
    title: 'Turkana Satellite Ground Station',
    titleSw: 'Kituo cha Ardhini cha Satelaiti cha Turkana',
    description: 'Northern radio telescope & Low Earth Orbit uplink for remote border outposts.',
    icon: '📡',
    sector: 'comms',
    isRestored: false,
    x: 300,
    y: 180,
    bearing: 340,
    region: 'Turkana Frontier',
    regionSw: 'Mpaka wa Turkana',
    pathId: 'cybersecurity',
    connections: ['node-server-eldoret'],
  },
  {
    id: 'node-mesh-mombasa',
    title: 'Mombasa Undersea Cable Terminal',
    titleSw: 'Kituo cha Waya wa Baharini cha Mombasa',
    description: 'Landing terminal for 5 trans-oceanic optic cables linking the continent to the global web.',
    icon: '🌊',
    sector: 'comms',
    isRestored: false,
    x: 740,
    y: 720,
    bearing: 135,
    region: 'Coast Maritime Line',
    regionSw: 'Pwani ya Bahari',
    pathId: 'the-rebuild-protocol',
    connections: ['node-comms-nairobi', 'node-secure-bunker'],
  },
  {
    id: 'node-secure-bunker',
    title: 'Kilifi Defensive Perimeter & Web Bunker',
    titleSw: 'Ngome ya Ulinzi wa Mtandao ya Kilifi',
    description: 'Hardened reverse-proxy bunker and incident response headquarters for the Coastal Corps.',
    icon: '🔒',
    sector: 'applications',
    isRestored: false,
    x: 770,
    y: 670,
    bearing: 125,
    region: 'Kilifi Ridge',
    regionSw: 'Milima ya Kilifi',
    pathId: 'cybersecurity',
    connections: ['node-mesh-mombasa', 'node-data-vault'],
  },
  {
    id: 'node-data-vault',
    title: 'Konza Technopolis Data Vault',
    titleSw: 'Hifadhi ya Data ya Konza',
    description: 'Subterranean national registry, digital identity, and cryptographic key authority.',
    icon: '🏛️',
    sector: 'data',
    isRestored: false,
    x: 570,
    y: 570,
    bearing: 140,
    region: 'Konza Silicon Savannah',
    regionSw: 'Konza Savannah',
    pathId: 'cybersecurity',
    connections: ['node-comms-nairobi', 'node-bank-machakos', 'node-secure-bunker'],
  },
  {
    id: 'node-bank-machakos',
    title: 'Machakos Mobile Money Ledger Node',
    titleSw: 'Kituo cha Pesa za Simu cha Machakos',
    description: 'Distributed transaction validator serving 18 million smallholder digital wallets.',
    icon: '🏦',
    sector: 'data',
    isRestored: false,
    x: 580,
    y: 520,
    bearing: 100,
    region: 'Eastern Hub',
    regionSw: 'Kitovu cha Mashariki',
    pathId: 'the-rebuild-protocol',
    connections: ['node-data-vault', 'node-comms-nairobi'],
  },
  {
    id: 'node-ai-layer',
    title: 'Mount Kenya Autonomous Relay',
    titleSw: 'Mnara wa Kiotomatiki wa Mlima Kenya',
    description: 'Solar-powered alpine telemetry node detecting anomalous BGP and power surges.',
    icon: '🤖',
    sector: 'compute',
    isRestored: false,
    x: 520,
    y: 380,
    bearing: 15,
    region: 'Highland Highlands',
    regionSw: 'Nyanda za Juu',
    pathId: 'cybersecurity',
    connections: ['node-comms-nairobi', 'node-hospital-nakuru'],
  },
];

/**
 * Compute the compass heading (N, NE, E, SE, S, SW, W, NW) from bearing in degrees.
 */
export function getHeading(degrees: number): CompassHeading {
  const norm = ((degrees % 360) + 360) % 360;
  if (norm >= 337.5 || norm < 22.5) return 'N';
  if (norm < 67.5) return 'NE';
  if (norm < 112.5) return 'E';
  if (norm < 157.5) return 'SE';
  if (norm < 202.5) return 'S';
  if (norm < 247.5) return 'SW';
  if (norm < 292.5) return 'W';
  return 'NW';
}

/**
 * Compute bearing from (x1, y1) to (x2, y2) on the 2D grid.
 * 0° is North (up), 90° East (right).
 */
export function calculateBearing(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y1 - y2; // Invert because SVG y increases downwards
  let deg = (Math.atan2(dx, dy) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return Math.round(deg);
}

/**
 * Approximate distance in km based on map coordinates.
 */
export function calculateDistanceKm(x1: number, y1: number, x2: number, y2: number): number {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  return Math.round(dist * 0.85); // Calibration constant for East Africa canvas scale
}
