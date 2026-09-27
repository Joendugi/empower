import { tradeProgrammes } from './trades';

export const RESERVED_PROGRAMME_IDS = new Set<string>([
  'tvet-ict-technician',
  'cybersecurity',
  ...tradeProgrammes.map((programme) => programme.id),
]);

export function isReservedProgrammeId(id: string) {
  return RESERVED_PROGRAMME_IDS.has(id);
}

export function safeCustomProgrammeId(id: string) {
  if (id.startsWith('custom-') && !RESERVED_PROGRAMME_IDS.has(id)) return id;
  const base = id.replace(/^custom-/, '') || 'course';
  return `custom-${base}-${Date.now()}`;
}
