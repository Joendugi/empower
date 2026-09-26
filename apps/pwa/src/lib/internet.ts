const PROBE_MS = 4000;
export const WEB_ADMITTED_KEY = 'empower-web-admitted';

export type InternetProbeReason =
  | 'offline'
  | 'ok'
  | 'api-ok'
  | 'origin-ok'
  | 'timeout'
  | 'unreachable';

export interface InternetProbeResult {
  online: boolean;
  apiUp: boolean;
  reason: InternetProbeReason;
}

function apiHealthUrl(apiBaseUrl: string): string {
  const base = apiBaseUrl.replace(/\/$/, '') || '/api/v1';
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return `${base}/health`;
  }
  if (typeof window === 'undefined') return `${base}/health`;
  return `${window.location.origin}${base.startsWith('/') ? '' : '/'}${base}/health`;
}

async function probeUrl(url: string, timeoutMs: number, method: 'GET' | 'HEAD' = 'GET'): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method,
      cache: 'no-store',
      signal: controller.signal,
      credentials: method === 'GET' && url.includes('/api/') ? 'include' : 'same-origin',
    });
    return res.type === 'opaqueredirect' || res.status > 0;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Web cold-start connectivity check.
 * Prefers the API /health probe, then falls back to a cache-busting same-origin HEAD.
 */
export async function probeInternet(
  apiBaseUrl = '/api/v1',
  timeoutMs = PROBE_MS
): Promise<InternetProbeResult> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { online: false, apiUp: false, reason: 'offline' };
  }
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    return { online: true, apiUp: true, reason: 'ok' };
  }

  try {
    const apiOk = await probeUrl(apiHealthUrl(apiBaseUrl), timeoutMs, 'GET');
    if (apiOk) {
      return { online: true, apiUp: true, reason: 'api-ok' };
    }

    const origin = new URL(window.location.href);
    origin.searchParams.set('__empower_net', String(Date.now()));
    const originOk = await probeUrl(origin.toString(), timeoutMs, 'HEAD');
    if (originOk) {
      return { online: true, apiUp: false, reason: 'origin-ok' };
    }
    return { online: false, apiUp: false, reason: 'unreachable' };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { online: false, apiUp: false, reason: 'timeout' };
    }
    return { online: false, apiUp: false, reason: 'unreachable' };
  }
}

export async function checkInternet(apiBaseUrl = '/api/v1', timeoutMs = PROBE_MS): Promise<boolean> {
  const result = await probeInternet(apiBaseUrl, timeoutMs);
  return result.online;
}

export function readWebAdmitted(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem(WEB_ADMITTED_KEY) === '1';
}

export function markWebAdmitted(): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(WEB_ADMITTED_KEY, '1');
}
