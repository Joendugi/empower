import { describe, expect, it } from 'vitest';
import { isValidKenyaPhone, phoneError, sanitizePhoneInput, validateEducatorApplication } from '@/lib/validate';

describe('phone and application validation', () => {
  it('strips letters from phone input', () => {
    expect(sanitizePhoneInput('07ab12 000 000')).toBe('0712000000');
    expect(sanitizePhoneInput('+254 712 000 000')).toBe('+254712000000');
  });

  it('accepts Kenyan mobiles only', () => {
    expect(isValidKenyaPhone('0712000000')).toBe(true);
    expect(isValidKenyaPhone('+254712000000')).toBe(true);
    expect(phoneError('hello')).toMatch(/only contain numbers/i);
    expect(phoneError('123')).toMatch(/Kenyan/i);
  });

  it('rejects a thin educator application', () => {
    const result = validateEducatorApplication({
      phone: '0712000000',
      county: 'Nai',
      institution: 'NTTI',
      tradeAreas: 'plumbing',
      qualifications: 'short',
      experienceYears: 2,
      statement: 'I teach',
    });
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
