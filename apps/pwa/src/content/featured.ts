import type { SkillPath } from '@cyberlearn/types';
import generatedCatalogue from './generated/catalogue.json';
import { getSkillPaths } from './index';

const FALLBACK_IDS = ['automotive', 'solar-energy', 'cybersecurity'] as const;
const fromCatalogue = (generatedCatalogue as { featuredPathIds?: string[] }).featuredPathIds;

export const PREFERRED_FEATURED_IDS: readonly string[] =
  fromCatalogue && fromCatalogue.length > 0 ? fromCatalogue : FALLBACK_IDS;

export function featuredSkillPaths(limit = 3): SkillPath[] {
  const paths = getSkillPaths();
  const picked: SkillPath[] = [];
  for (const id of PREFERRED_FEATURED_IDS) {
    const match = paths.find((path) => path.id === id);
    if (match) picked.push(match);
  }
  for (const path of paths) {
    if (picked.length >= limit) break;
    if (!picked.some((item) => item.id === path.id)) picked.push(path);
  }
  return picked.slice(0, limit);
}
