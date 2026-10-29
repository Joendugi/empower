import { describe, it, expect } from 'vitest';
import {
  CIVILIZATION_NODES,
  calculateBearing,
  calculateDistanceKm,
  getHeading,
} from '@/components/narrative/civilizationData';

describe('Civilization Narrative Map & Compass Mechanics', () => {
  it('has 10 registered civilization infrastructure nodes', () => {
    expect(CIVILIZATION_NODES.length).toBe(10);
    for (const node of CIVILIZATION_NODES) {
      expect(node.id).toBeDefined();
      expect(node.title).toBeDefined();
      expect(node.x).toBeGreaterThan(0);
      expect(node.y).toBeGreaterThan(0);
      expect(['power', 'comms', 'compute', 'data', 'applications']).toContain(node.sector);
    }
  });

  it('computes correct cardinal and intercardinal compass headings', () => {
    expect(getHeading(0)).toBe('N');
    expect(getHeading(45)).toBe('NE');
    expect(getHeading(90)).toBe('E');
    expect(getHeading(135)).toBe('SE');
    expect(getHeading(180)).toBe('S');
    expect(getHeading(225)).toBe('SW');
    expect(getHeading(270)).toBe('W');
    expect(getHeading(315)).toBe('NW');
    expect(getHeading(360)).toBe('N');
  });

  it('computes accurate 2D grid bearings', () => {
    // Due East
    expect(calculateBearing(100, 100, 200, 100)).toBe(90);
    // Due South
    expect(calculateBearing(100, 100, 100, 200)).toBe(180);
    // Due West
    expect(calculateBearing(200, 100, 100, 100)).toBe(270);
    // Due North
    expect(calculateBearing(100, 200, 100, 100)).toBe(0);
  });

  it('computes distance approximations between nodes in km', () => {
    const nairobi = CIVILIZATION_NODES.find((n) => n.id === 'node-comms-nairobi')!;
    const mombasa = CIVILIZATION_NODES.find((n) => n.id === 'node-mesh-mombasa')!;
    const dist = calculateDistanceKm(nairobi.x!, nairobi.y!, mombasa.x!, mombasa.y!);
    expect(dist).toBeGreaterThan(200);
    expect(dist).toBeLessThan(450);
  });

  it('connects key nodes in the East Africa mesh', () => {
    const nairobi = CIVILIZATION_NODES.find((n) => n.id === 'node-comms-nairobi')!;
    expect(nairobi.connections).toContain('node-mesh-mombasa');
    expect(nairobi.connections).toContain('node-grid-olaria');
  });
});
