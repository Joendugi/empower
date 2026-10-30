import type { TokenResponse } from '@cyberlearn/types';
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

function canUseCloud(path: string) {
  return isAuthPath(path) || path.startsWith('/notices/');
}

let refreshing: Promise<boolean> | null = null;

/**
 * Trade the refresh cookie for a new access cookie. Concurrent callers share one request,
 * because the server rotates the refresh token on every use.
 */
export function refreshCloudSession(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const apiBase = usePlatformStore.getState().apiBaseUrl.replace(/\/$/, '') || '/api/v1';
        const res = await fetch(`${apiBase}/auth/refresh`, { method: 'POST', credentials: 'include' });
        if (!res.ok) return false;
        const body = (await res.json()) as TokenResponse;
        useLearnerStore
          .getState()
          .applyAuth(body.accessToken || CLOUD_COOKIE_TOKEN, body.learner, body.sessionExpiresAt);
        return true;
      } catch {
        return false;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

export async function api<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const token = useLearnerStore.getState().token;
  const platform = usePlatformStore.getState();
  const apiBase = platform.apiBaseUrl.replace(/\/$/, '') || '/api/v1';
  const localHit = () => resolveLocalApi<T>(path, method, init.body);
  const skipNetwork =
    platform.deploymentMode === 'offline' ||
    cloudRecentlyDown() ||
    (isLocalToken(token) && !canUseCloud(path));

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
  // FormData sets its own multipart boundary; only default JSON bodies to application/json.
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
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
    const timeoutMs = Math.min(25_000, Math.max(2000, platform.requestTimeoutMs || 8000));
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetch(`${apiBase}${path}`, {
        ...init,
        headers,
        credentials: 'include',
        signal: controller.signal,
      });
    } finally {
      window.clearTimeout(timer);
    }

    if (res.status === 401 && token && token !== OFFLINE_TOKEN && !isLocalToken(token) && !isAuthPath(path)) {
      // Access tokens last minutes. Renew once and retry; only a failed renewal ends the cloud session.
      if (!retried && (await refreshCloudSession())) {
        return api<T>(path, init, true);
      }
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
      throw new ApiError(504, 'Could not reach the server. Your work is still saved here.');
    }
    throw error;
  }
}
