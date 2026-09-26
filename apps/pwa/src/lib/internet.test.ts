import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkInternet, probeInternet } from '@/lib/internet';

describe('probeInternet', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fails immediately when navigator reports offline', async () => {
    vi.stubGlobal('navigator', { onLine: false });
    await expect(probeInternet()).resolves.toMatchObject({
      online: false,
      apiUp: false,
      reason: 'offline',
    });
  });

  it('prefers a successful API health probe', async () => {
    vi.stubGlobal('navigator', { onLine: true });
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/health')) {
        return { ok: true, status: 200, type: 'basic' };
      }
      throw new Error('should not fall back');
    });
    vi.stubGlobal('fetch', fetchMock);
    await expect(probeInternet('/api/v1')).resolves.toMatchObject({
      online: true,
      apiUp: true,
      reason: 'api-ok',
    });
    expect(fetchMock).toHaveBeenCalled();
  });

  it('falls back to same-origin when API is down but the network works', async () => {
    vi.stubGlobal('navigator', { onLine: true });
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/health')) return { ok: false, status: 0, type: 'error' };
      return { ok: true, status: 200, type: 'basic' };
    });
    vi.stubGlobal('fetch', fetchMock);
    // Force API probe to count as failed (status 0 → false in probeUrl)
    fetchMock.mockImplementationOnce(async () => ({ ok: false, status: 0, type: 'error' }));
    fetchMock.mockImplementationOnce(async () => ({ ok: true, status: 200, type: 'basic' }));
    await expect(probeInternet('/api/v1')).resolves.toMatchObject({
      online: true,
      apiUp: false,
      reason: 'origin-ok',
    });
  });

  it('fails when neither API nor origin can be reached', async () => {
    vi.stubGlobal('navigator', { onLine: true });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch');
      })
    );
    await expect(checkInternet()).resolves.toBe(false);
  });
});
