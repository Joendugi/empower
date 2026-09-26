import { describe, expect, it } from 'vitest';
import { isCacheableMediaUrl } from '@/lib/programmePack';
import { isSessionFresh, readJwtExpiryMs, sessionExpiryForToken } from '@/lib/sessionSecurity';

describe('session security', () => {
  it('reads expiry from a JWT payload', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = btoa(JSON.stringify({ sub: 'abc', exp }));
    const token = `header.${payload}.sig`;
    const expiry = readJwtExpiryMs(token);
    expect(expiry).toBe(exp * 1000);
  });

  it('uses a local window when the token is not a JWT', () => {
    const now = 1_700_000_000_000;
    expect(sessionExpiryForToken('local-user:1', now)).toBeGreaterThan(now);
  });

  it('rejects an expired or idle session', () => {
    const now = 1_700_000_000_000;
    expect(
      isSessionFresh({
        expiresAt: now - 1,
        lastActiveAt: now,
        deviceId: null,
        now,
      })
    ).toBe(false);
    expect(
      isSessionFresh({
        expiresAt: now + 1000,
        lastActiveAt: now - 13 * 60 * 60 * 1000,
        deviceId: null,
        now,
      })
    ).toBe(false);
    expect(
      isSessionFresh({
        expiresAt: now + 10000,
        lastActiveAt: now - 16 * 60 * 1000, // 16 minutes ago (exceeds 15 min idle)
        deviceId: null,
        now,
      })
    ).toBe(false);
    expect(
      isSessionFresh({
        expiresAt: now + 10000,
        lastActiveAt: now - 5 * 60 * 1000, // 5 minutes ago (valid)
        deviceId: null,
        now,
      })
    ).toBe(true);
  });
});

describe('programme media cache', () => {
  it('caches direct lesson files and skips YouTube', () => {
    expect(isCacheableMediaUrl('https://cdn.example.com/weld.mp4')).toBe(true);
    expect(isCacheableMediaUrl('https://www.youtube.com/watch?v=abc')).toBe(false);
    expect(isCacheableMediaUrl('idb:file-1')).toBe(false);
  });
});
