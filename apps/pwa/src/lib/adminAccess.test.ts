import { beforeEach, describe, expect, it } from 'vitest';
import { hashSecret, hasAdminGrant, tryStaffUnlock } from '@/lib/adminAccess';

describe('admin office access', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('hashes staff secrets instead of storing them', async () => {
    const hashed = await hashSecret('dev-office-key-change-me');
    expect(hashed).toHaveLength(64);
    expect(hashed.includes('dev-office')).toBe(false);
  });

  it('rejects a short or wrong passphrase', async () => {
    expect(await tryStaffUnlock('short', 'hod@poly.ac.ke')).toBe('denied');
    expect(hasAdminGrant('hod@poly.ac.ke')).toBe(false);
  });

  it('grants only after the configured staff key', async () => {
    const result = await tryStaffUnlock('dev-office-key-change-me', 'hod@poly.ac.ke');
    expect(result).toBe('ok');
    expect(hasAdminGrant('hod@poly.ac.ke')).toBe(true);
    expect(hasAdminGrant('other@poly.ac.ke')).toBe(false);
  });
});
