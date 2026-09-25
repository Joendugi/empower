import { usePlatformStore } from '@/store/platformStore';

const FRESH_MS = 20_000;
let lastCheck = 0;
let lastOk = false;

export function cloudRecentlyDown() {
  return Date.now() - lastCheck < FRESH_MS && !lastOk;
}

export function markCloud(ok: boolean) {
  lastCheck = Date.now();
  lastOk = ok;
}

export async function probeApiHealth(): Promise<boolean> {
  const platform = usePlatformStore.getState();
  if (platform.deploymentMode === 'offline') {
    markCloud(false);
    return false;
  }
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    markCloud(false);
    return false;
  }
  if (Date.now() - lastCheck < FRESH_MS) return lastOk;

  const apiBase = platform.apiBaseUrl.replace(/\/$/, '') || '/api/v1';
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), Math.min(platform.requestTimeoutMs, 1600));
    const res = await fetch(`${apiBase}/health`, { signal: controller.signal });
    window.clearTimeout(timer);
    markCloud(res.ok);
    return res.ok;
  } catch {
    markCloud(false);
    return false;
  }
}
