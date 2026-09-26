import { beforeEach, describe, expect, it } from 'vitest';
import { ACCOUNTS_KEY, loginLocal, registerLocal } from '@/lib/localAccounts';

describe('local accounts', () => {
  beforeEach(() => {
    localStorage.removeItem(ACCOUNTS_KEY);
  });

  it('registers a device account that is not a guest', async () => {
    const session = await registerLocal({
      email: 'trainer@poly.ac.ke',
      password: 'workshop1',
      displayName: 'Amina',
      preferredLanguage: 'en',
      accountType: 'educator',
    });
    expect(session.learner.isGuest).toBe(false);
    expect(session.learner.email).toBe('trainer@poly.ac.ke');
    expect(session.accessToken.startsWith('local-user:')).toBe(true);
  });

  it('stores a PBKDF2 hash instead of unsalted SHA-256', async () => {
    await registerLocal({
      email: 'hash@poly.ac.ke',
      password: 'workshop1',
      displayName: 'Hash',
    });
    const raw = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]') as Array<{ passwordHash: string }>;
    expect(raw[0]?.passwordHash.startsWith('empower-v2:pbkdf2:sha256:')).toBe(true);
    expect(raw[0]?.passwordHash.includes('workshop1')).toBe(false);
  });

  it('upgrades a legacy SHA-256 device hash on the next sign-in', async () => {
    const email = 'legacy@poly.ac.ke';
    const data = new TextEncoder().encode(`empower-v1:${email}:workshop1`);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const hex = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
    localStorage.setItem(
      ACCOUNTS_KEY,
      JSON.stringify([
        {
          id: 'loc-legacy',
          email,
          passwordHash: hex,
          displayName: 'Old',
          preferredLanguage: 'en',
          accountType: 'learner',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
      ])
    );
    const session = await loginLocal(email, 'workshop1');
    expect(session.learner.email).toBe(email);
    const upgraded = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]') as Array<{ passwordHash: string }>;
    expect(upgraded[0]?.passwordHash.startsWith('empower-v2:pbkdf2:sha256:')).toBe(true);
  });

  it('signs the same account back in', async () => {
    await registerLocal({
      email: 'learner@poly.ac.ke',
      password: 'workshop1',
      displayName: 'Joe',
    });
    const session = await loginLocal('learner@poly.ac.ke', 'workshop1');
    expect(session.learner.displayName).toBe('Joe');
    expect(session.accessToken.startsWith('local-user:')).toBe(true);
  });

  it('rejects a wrong password', async () => {
    await registerLocal({
      email: 'learner@poly.ac.ke',
      password: 'workshop1',
      displayName: 'Joe',
    });
    await expect(loginLocal('learner@poly.ac.ke', 'wrongpass')).rejects.toMatchObject({
      status: 401,
    });
  });

  it('does not register the same email twice', async () => {
    const payload = { email: 'repeat@poly.ac.ke', password: 'workshop1', displayName: 'One' };
    await registerLocal(payload);
    await expect(registerLocal(payload)).rejects.toMatchObject({ status: 409 });
  });
});
