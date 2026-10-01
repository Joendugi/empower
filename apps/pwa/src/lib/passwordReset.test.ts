import { beforeEach, describe, expect, it } from 'vitest';
import { ACCOUNTS_KEY, loginLocal, registerLocal } from '@/lib/localAccounts';
import { completePasswordReset, requestPasswordReset } from '@/lib/passwordReset';

describe('password reset', () => {
  beforeEach(() => {
    localStorage.removeItem(ACCOUNTS_KEY);
    localStorage.removeItem('empower-reset-codes');
  });

  it('resets a local password after a valid code', async () => {
    await registerLocal({
      email: 'learner@poly.ac.ke',
      password: 'workshop1',
      displayName: 'Joe',
    });
    await requestPasswordReset('learner@poly.ac.ke', 'email');
    const stored = JSON.parse(localStorage.getItem('empower-reset-codes') || '[]') as Array<{ code: string }>;
    await completePasswordReset('learner@poly.ac.ke', stored[0]?.code ?? '', 'newpass18');
    const session = await loginLocal('learner@poly.ac.ke', 'newpass18');
    expect(session.learner.email).toBe('learner@poly.ac.ke');
  });

  it('refuses SMS reset when the account has no phone', async () => {
    await registerLocal({
      email: 'nophone@poly.ac.ke',
      password: 'workshop1',
      displayName: 'No Phone',
    });
    await expect(requestPasswordReset('nophone@poly.ac.ke', 'sms')).rejects.toThrow(/phone/i);
  });
});
