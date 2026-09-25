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
