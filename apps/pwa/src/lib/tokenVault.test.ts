import { describe, expect, it } from 'vitest';
import { persistHasRawToken } from '@/lib/tokenVault';

describe('token vault', () => {
  it('treats persisted learner blobs with a token as exposed', () => {
    expect(persistHasRawToken({ token: 'eyJhbGciOiJIUzI1NiJ9.payload.sig' })).toBe(true);
    expect(persistHasRawToken({ token: 'local-user:abc' })).toBe(true);
  });

  it('allows progress-only persist without a token', () => {
    expect(persistHasRawToken({ email: 'a@b.c', xp: 10 })).toBe(false);
    expect(persistHasRawToken({ token: null })).toBe(false);
  });
});
