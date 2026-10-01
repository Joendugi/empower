import { normalizePhone } from '@/lib/notify';

/** Keep only + and digits while the user types. */
export function sanitizePhoneInput(value: string) {
  const plus = value.trim().startsWith('+') ? '+' : '';
  return `${plus}${value.replace(/\D/g, '')}`.slice(0, 16);
}

export function isValidKenyaPhone(phone: string) {
  const normalized = normalizePhone(phone);
  return /^\+2547\d{8}$/.test(normalized) || /^\+2541\d{8}$/.test(normalized);
}

export function phoneError(phone: string, required = false) {
  const trimmed = phone.trim();
  if (!trimmed) return required ? 'Enter a phone number' : '';
  if (/[^\d+\s]/.test(trimmed)) return 'Phone can only contain numbers';
  if (!isValidKenyaPhone(trimmed)) return 'Use a Kenyan mobile number, e.g. 0712 000 000';
  return '';
}

export function validateEducatorApplication(input: {
  phone: string;
  county: string;
  institution: string;
  tradeAreas: string;
  qualifications: string;
  experienceYears: number;
  statement: string;
}) {
  const errors: string[] = [];
  const phone = phoneError(input.phone, true);
  if (phone) errors.push(phone);
  if (input.county.trim().length < 3) errors.push('County is required');
  if (input.institution.trim().length < 3) errors.push('Institution or workshop is required');
  if (input.tradeAreas.trim().length < 3) errors.push('Trade areas are required');
  if (input.qualifications.trim().length < 12) errors.push('Add qualifications, licence numbers, or a verifier the office can call');
  if (!Number.isFinite(input.experienceYears) || input.experienceYears < 0 || input.experienceYears > 60) {
    errors.push('Years of experience must be a number from 0 to 60');
  }
  const statementWords = input.statement.trim().split(/\s+/).filter(Boolean).length;
  if (statementWords < 12) errors.push('Explain how you will grade and run instructor-led sessions (at least 12 words)');
  return {
    ok: errors.length === 0,
    errors,
    phone: normalizePhone(input.phone),
  };
}
