import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkInternet } from '@/lib/internet';

describe('checkInternet', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fails immediately when navigator reports offline', async () => {
    vi.stubGlobal('navigator', { onLine: false });
    await expect(checkInternet()).resolves.toBe(false);
  });

  it('passes when a same-origin probe responds', async () => {
    vi.stubGlobal('navigator', { onLine: true });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, status: 200, type: 'basic' }))
    );
    await expect(checkInternet()).resolves.toBe(true);
    expect(fetch).toHaveBeenCalled();
  });

  it('fails when the probe cannot reach the network', async () => {
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
