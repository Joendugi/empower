import type { TokenResponse } from '@cyberlearn/types';
import { api, ApiError } from '@/lib/api';
import { cloudRecentlyDown, probeApiHealth } from '@/lib/cloudCircuit';
import {
  LocalAuthError,
  loginLocal,
  registerLocal,
  upsertLocalAccount,
  type AuthPayload,
} from '@/lib/localAccounts';
import { usePlatformStore } from '@/store/platformStore';

export type AuthMode = 'login' | 'register';

function asApiError(error: unknown, fallback: string): never {
  if (error instanceof ApiError || error instanceof LocalAuthError) {
    throw new ApiError(error.status, error.message);
  }
  throw new ApiError(503, error instanceof Error ? error.message : fallback);
}

function shouldStayLocal() {
  const platform = usePlatformStore.getState();
  return platform.deploymentMode === 'offline' || (typeof navigator !== 'undefined' && !navigator.onLine);
}

async function localAuth(mode: AuthMode, payload: AuthPayload, email: string, password: string) {
  if (mode === 'register') {
    try {
      return await registerLocal(payload);
    } catch (error) {
      if (error instanceof LocalAuthError && error.status === 409) {
        return loginLocal(email, password);
      }
      throw error;
    }
  }
  return loginLocal(email, password);
}

export async function authenticate(input: AuthPayload & { mode: AuthMode }): Promise<TokenResponse> {
  const email = input.email.trim();
  const password = input.password;
  const payload = {
    email,
    password,
    displayName: input.displayName,
    preferredLanguage: input.preferredLanguage ?? 'en',
    accountType: input.accountType ?? 'learner',
  };

  const useLocalOnly = shouldStayLocal() || cloudRecentlyDown() || !(await probeApiHealth());
  if (useLocalOnly) {
    try {
      return await localAuth(input.mode, payload, email, password);
    } catch (error) {
      asApiError(error, 'Sign in failed on this device');
    }
  }

  try {
    const path = input.mode === 'login' ? '/auth/login' : '/auth/register';
    const body =
      input.mode === 'login'
        ? { email, password }
        : {
            email,
            password,
            displayName: payload.displayName,
            preferredLanguage: payload.preferredLanguage,
          };
    const remote = await api<TokenResponse>(path, { method: 'POST', body: JSON.stringify(body) });
    await upsertLocalAccount({
      email,
      password,
      displayName: remote.learner.displayName || payload.displayName,
      preferredLanguage: remote.learner.preferredLanguage,
      accountType: payload.accountType,
    });
    return remote;
  } catch (error) {
    if (error instanceof ApiError && error.status === 409 && input.mode === 'register') {
      try {
        const remote = await api<TokenResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        await upsertLocalAccount({
          email,
          password,
          displayName: remote.learner.displayName || payload.displayName,
          preferredLanguage: remote.learner.preferredLanguage,
          accountType: payload.accountType,
        });
        return remote;
      } catch {
        /* fall through to local */
      }
    }

    try {
      return await localAuth(input.mode, payload, email, password);
    } catch (localError) {
      asApiError(error instanceof ApiError ? error : localError, 'Sign in failed');
    }
  }
}

export { probeApiHealth };
