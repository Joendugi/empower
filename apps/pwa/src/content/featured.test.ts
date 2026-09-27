import { describe, expect, it } from 'vitest';
import { featuredSkillPaths, PREFERRED_FEATURED_IDS } from './featured';
import { getSkillPaths } from './index';

describe('featuredSkillPaths', () => {
  it('uses catalogue featured ids that exist as programmes', () => {
    const catalogueIds = new Set(getSkillPaths().map((path) => path.id));
    expect(PREFERRED_FEATURED_IDS.length).toBeGreaterThan(0);
    for (const id of PREFERRED_FEATURED_IDS) {
      expect(catalogueIds.has(id)).toBe(true);
    }
  });

  it('only returns ids that exist on the live catalogue', () => {
    const catalogueIds = new Set(getSkillPaths().map((path) => path.id));
    const featured = featuredSkillPaths(3);
    expect(featured.length).toBeGreaterThan(0);
    for (const path of featured) {
      expect(catalogueIds.has(path.id)).toBe(true);
    }
  });
});
