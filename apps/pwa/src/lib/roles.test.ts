import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ACCOUNTS_KEY, registerLocal } from '@/lib/localAccounts';
import { resolveAccountRole, type RoleInput } from '@/lib/roles';
import { api } from '@/lib/api';
import { CLOUD_COOKIE_TOKEN } from '@/lib/tokenVault';
import { useLearnerStore } from '@/store/learnerStore';

const base: RoleInput = {
  authSource: 'cloud',
  accountRole: 'learner',
  email: 'trainer@poly.ac.ke',
  campusMode: false,
  approvedLocally: false,
};

describe('account roles', () => {
  beforeEach(async () => {
    localStorage.removeItem(ACCOUNTS_KEY);
    await registerLocal({
      email: 'trainer@poly.ac.ke',
      password: 'workshop1',
      displayName: 'Amina',
      accountType: 'admin',
    });
  });

  it('uses only the server role for cloud sign-ins', () => {
    // The device account says admin; the server says learner. The server wins.
    expect(resolveAccountRole(base)).toBe('learner');
    expect(resolveAccountRole({ ...base, accountRole: 'educator' })).toBe('educator');
    expect(resolveAccountRole({ ...base, approvedLocally: true })).toBe('learner');
  });

  it('never grants staff or educator to a device-only session in cloud mode', () => {
    expect(resolveAccountRole({ ...base, authSource: 'local', approvedLocally: true })).toBe('learner');
  });

  it('honours device accounts in campus mode', () => {
    expect(resolveAccountRole({ ...base, authSource: 'local', campusMode: true })).toBe('admin');
    expect(
      resolveAccountRole({ ...base, authSource: 'local', campusMode: true, email: 'other@poly.ac.ke', approvedLocally: true })
    ).toBe('educator');
  });

  it('treats signed-out visitors as learners', () => {
    expect(resolveAccountRole({ ...base, authSource: null, accountRole: 'admin' })).toBe('learner');
  });
});

describe('server sessions', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    useLearnerStore.getState().lockSession();
  });

  it('keeps the server role and session end from sign-in', () => {
    const ends = new Date(Date.now() + 30 * 86_400_000).toISOString();
    useLearnerStore.getState().applyAuth(
      CLOUD_COOKIE_TOKEN,
      {
        id: 'l1',
        email: 'amina@poly.ac.ke',
        displayName: 'Amina',
        preferredLanguage: 'en',
        totalXp: 0,
        level: 1,
        isGuest: false,
        role: 'educator',
      },
      ends
    );
    const state = useLearnerStore.getState();
    expect(state.accountRole).toBe('educator');
    expect(state.sessionExpiresAt).toBe(Date.parse(ends));
  });

  it('renews an expired access token once and retries the request', async () => {
    useLearnerStore.getState().applyAuth(CLOUD_COOKIE_TOKEN, {
      id: 'l1',
      email: 'amina@poly.ac.ke',
      displayName: 'Amina',
      preferredLanguage: 'en',
      totalXp: 0,
      level: 1,
      isGuest: false,
      role: 'learner',
    });
    const calls: string[] = [];
    let profileCalls = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        calls.push(url.replace(/^.*\/api\/v1/, ''));
        if (url.endsWith('/auth/refresh')) {
          return new Response(
            JSON.stringify({
              accessToken: '',
              tokenType: 'bearer',
              learner: { id: 'l1', email: 'amina@poly.ac.ke', displayName: 'Amina', preferredLanguage: 'en', totalXp: 0, level: 1, isGuest: false, role: 'educator' },
            }),
            { status: 200 }
          );
        }
        profileCalls += 1;
        return profileCalls === 1
          ? new Response(JSON.stringify({ detail: 'Invalid or expired token' }), { status: 401 })
          : new Response(JSON.stringify({ ok: true }), { status: 200 });
      })
    );

    await expect(api<{ ok: boolean }>('/progress/me')).resolves.toEqual({ ok: true });
    expect(calls).toEqual(['/progress/me', '/auth/refresh', '/progress/me']);
    // The renewed session carries the role the server sent.
    expect(useLearnerStore.getState().accountRole).toBe('educator');
  });
});
