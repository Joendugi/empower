const SESSION_TOKEN_KEY = 'empower-session-token';
export const CLOUD_COOKIE_TOKEN = 'cloud-cookie';

export function readSessionToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    return sessionStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function writeSessionToken(token: string | null) {
  if (typeof sessionStorage === 'undefined') return;
  try {
    if (!token) sessionStorage.removeItem(SESSION_TOKEN_KEY);
    else sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  } catch {
    /* private mode */
  }
}

export function clearSessionToken() {
  writeSessionToken(null);
}

export function persistHasRawToken(value: unknown) {
  if (!value || typeof value !== 'object') return false;
  const token = (value as { token?: unknown }).token;
  return typeof token === 'string' && token.length > 0;
}
