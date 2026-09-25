import { useLearnerStore } from '@/store/learnerStore';
import { cloudRecentlyDown, markCloud } from '@/lib/cloudCircuit';
import { LocalAuthError } from '@/lib/localAccounts';
import { isLocalToken, OFFLINE_TOKEN, resolveLocalApi } from '@/lib/localApi';
import { CLOUD_COOKIE_TOKEN } from '@/lib/tokenVault';
import { usePlatformStore } from '@/store/platformStore';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

function isAuthPath(path: string) {
  return path.startsWith('/auth/');
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const token = useLearnerStore.getState().token;
  const platform = usePlatformStore.getState();
  const apiBase = platform.apiBaseUrl.replace(/\/$/, '') || '/api/v1';
  const localHit = () => resolveLocalApi<T>(path, method, init.body);
  const skipNetwork =
    platform.deploymentMode === 'offline' ||
    cloudRecentlyDown() ||
    (isLocalToken(token) && !isAuthPath(path));

  const fromLocal = async () => {
    try {
      return await localHit();
    } catch (error) {
      if (error instanceof LocalAuthError) {
        throw new ApiError(error.status, error.message);
      }
      throw error;
    }
  };

  if (skipNetwork) {
    const local = await fromLocal();
    if (local !== undefined) return local;
    if (isAuthPath(path)) {
      throw new ApiError(401, 'Invalid email or password');
    }
    throw new ApiError(503, 'Offline mode — saved on this device only');
  }

  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  const sessionOk = useLearnerStore.getState().isSessionValid();
  if (
    token &&
    token !== CLOUD_COOKIE_TOKEN &&
    !isLocalToken(token) &&
    !isAuthPath(path) &&
    sessionOk
  ) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), platform.requestTimeoutMs);
    const res = await fetch(`${apiBase}${path}`, {
      ...init,
      headers,
      credentials: 'include',
      signal: controller.signal,
    });
    window.clearTimeout(timer);

    if (res.status === 401 && token && token !== OFFLINE_TOKEN && !isLocalToken(token) && !isAuthPath(path)) {
      useLearnerStore.getState().downgradeToLocal();
    }
    if (!res.ok) {
      if (res.status >= 500) markCloud(false);
      const local = await fromLocal();
      if (local !== undefined) return local;
      let detail = res.statusText;
      try {
        const body = (await res.json()) as { detail?: string };
        if (body.detail) detail = body.detail;
      } catch {
        /* ignore */
      }
      throw new ApiError(res.status, detail);
    }
    if (res.status === 204) return undefined as T;
    markCloud(true);
    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status >= 500) markCloud(false);
      throw error;
    }
    markCloud(false);
    const local = await fromLocal();
    if (local !== undefined) return local;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(504, 'The campus/cloud API timed out. Your account can still work on this device.');
    }
    throw error;
  }
}
