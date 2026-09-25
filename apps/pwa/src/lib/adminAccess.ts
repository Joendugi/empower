import { getDeviceId } from '@/lib/sessionSecurity';
import { usePlatformStore } from '@/store/platformStore';

const GRANT_KEY = 'empower-admin-grant';
const FAIL_KEY = 'empower-admin-fails';
const MAX_FAILS = 5;
const GRANT_MS = 4 * 60 * 60 * 1000;

export const OFFICE_PATH = '/office';

export async function hashSecret(value: string) {
  const data = new TextEncoder().encode(`empower-staff-v1:${value.trim()}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function expectedStaffHash() {
  const baked = import.meta.env.VITE_ADMIN_STAFF_HASH?.trim().toLowerCase();
  if (baked && /^[a-f0-9]{64}$/.test(baked)) return baked;
  if (import.meta.env.DEV) return hashSecret('dev-office-key-change-me');
  return null;
}

export function clearAdminGrant() {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(GRANT_KEY);
  sessionStorage.removeItem('empower-admin');
}

export function hasAdminGrant(email?: string | null) {
  if (typeof sessionStorage === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(GRANT_KEY);
    if (!raw) return false;
    const grant = JSON.parse(raw) as { exp?: number; deviceId?: string; email?: string };
    if (!grant.exp || Date.now() > grant.exp) {
      clearAdminGrant();
      return false;
    }
    if (grant.deviceId && grant.deviceId !== getDeviceId()) return false;
    if (email && grant.email && grant.email !== email.trim().toLowerCase()) return false;
    return true;
  } catch {
    return false;
  }
}

export async function tryStaffUnlock(passphrase: string, email: string) {
  if (typeof sessionStorage === 'undefined') return 'denied' as const;
  const fails = Number(sessionStorage.getItem(FAIL_KEY) || '0');
  if (fails >= MAX_FAILS) return 'locked' as const;
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || passphrase.trim().length < 10) {
    sessionStorage.setItem(FAIL_KEY, String(fails + 1));
    return 'denied' as const;
  }
  const expected = await expectedStaffHash();
  let allowed = false;
  if (expected) {
    allowed = (await hashSecret(passphrase)) === expected;
  } else {
    try {
      const apiBase = usePlatformStore.getState().apiBaseUrl.replace(/\/$/, '') || '/api/v1';
      const response = await fetch(`${apiBase}/auth/office-unlock`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase, email: normalizedEmail }),
      });
      allowed = response.ok;
    } catch {
      allowed = false;
    }
  }
  if (!allowed) {
    sessionStorage.setItem(FAIL_KEY, String(fails + 1));
    return 'denied' as const;
  }
  sessionStorage.removeItem(FAIL_KEY);
  sessionStorage.setItem(
    GRANT_KEY,
    JSON.stringify({
      exp: Date.now() + GRANT_MS,
      deviceId: getDeviceId(),
      email: normalizedEmail,
    })
  );
  return 'ok' as const;
}
