import { describe, expect, it } from 'vitest';
import { qrMatrix, scanCodeFor } from '@/lib/qrV1';

describe('scan QR', () => {
  it('encodes a short campus code as a 21 module square', () => {
    const code = scanCodeFor('plumbing');
    expect(code).toBe('E/PLUMBING');
    const matrix = qrMatrix(code);
    expect(matrix).toHaveLength(21);
    expect(matrix[0]?.length).toBe(21);
    expect(matrix[0]?.[0]).toBe(true);
    expect(matrix[6]?.[0]).toBe(true);
  });
});
