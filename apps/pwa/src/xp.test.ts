import { describe, expect, it } from 'vitest';
import { xpToLevel } from '@/store/learnerStore';
import { normalizeAnswer } from '@/lib/hash';

describe('xpToLevel', () => {
  it('starts at level 1', () => {
    expect(xpToLevel(0)).toBe(1);
  });

  it('reaches level 2 at 100 XP', () => {
    expect(xpToLevel(100)).toBe(2);
  });
});

describe('normalizeAnswer', () => {
  it('trims and lowercases', () => {
    expect(normalizeAnswer('  TCP  ')).toBe('tcp');
  });

  it('joins lists for match-style answers', () => {
    expect(normalizeAnswer(['l2=frame', 'l3=packet'])).toBe('l2=frame|l3=packet');
  });
});
