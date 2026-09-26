const PROBE_MS = 4000;

/**
 * Web entry requires a live internet path.
 * Uses navigator.onLine first, then a cache-busting same-origin probe.
 */
export async function checkInternet(timeoutMs = PROBE_MS): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false;
  }
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    return true;
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('__empower_net', String(Date.now()));
    const res = await fetch(url.toString(), {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });
    // Any network response means the browser reached the origin.
    return res.type === 'opaqueredirect' || res.status > 0;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}
