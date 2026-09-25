export const DEVICE_KEY = 'empower-device-id';
export const LOCAL_SESSION_MS = 7 * 24 * 60 * 60 * 1000;
export const IDLE_SESSION_MS = 12 * 60 * 60 * 1000;

export type AuthSource = 'local' | 'cloud';

export function getDeviceId(): string {
  if (typeof localStorage === 'undefined') return 'device-unknown';
  const existing = localStorage.getItem(DEVICE_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(DEVICE_KEY, created);
  return created;
}

export function newSessionId(): string {
  return crypto.randomUUID();
}

export function readJwtExpiryMs(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(normalized)) as { exp?: number; sub?: string };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function sessionExpiryForToken(token: string, now = Date.now()): number {
  const jwtExp = readJwtExpiryMs(token);
  if (jwtExp && jwtExp > now) return jwtExp;
  return now + LOCAL_SESSION_MS;
}

export function isSessionFresh(input: {
  expiresAt: number | null;
  lastActiveAt: number | null;
  deviceId: string | null;
  now?: number;
}): boolean {
  const now = input.now ?? Date.now();
  if (input.expiresAt && now > input.expiresAt) return false;
  if (input.lastActiveAt && now - input.lastActiveAt > IDLE_SESSION_MS) return false;
  if (input.deviceId && input.deviceId !== getDeviceId()) return false;
  return true;
}

export function yieldToUi(ms = 0) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
