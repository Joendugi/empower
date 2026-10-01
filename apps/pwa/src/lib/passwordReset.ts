import { api } from '@/lib/api';
import {
  findLocalAccount,
  normalizeEmail,
  resetLocalPassword,
  LocalAuthError,
} from '@/lib/localAccounts';
import { openFreeMessage, type NoticeChannel } from '@/lib/notify';

const RESET_KEY = 'empower-reset-codes';

interface ResetRecord {
  email: string;
  code: string;
  expiresAt: number;
  channel: NoticeChannel;
}

function readCodes(): ResetRecord[] {
  try {
    const raw = localStorage.getItem(RESET_KEY);
    return raw ? (JSON.parse(raw) as ResetRecord[]) : [];
  } catch {
    return [];
  }
}

function writeCodes(records: ResetRecord[]) {
  localStorage.setItem(RESET_KEY, JSON.stringify(records));
}

function sixDigits() {
  return String(100000 + Math.floor(Math.random() * 900000));
}

export async function requestPasswordReset(email: string, channel: NoticeChannel) {
  if (channel === 'email') {
    try {
      const result = await api<{ mailed?: boolean }>('/auth/password-reset/request', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      });
      if (result.mailed) {
        return { channel, expiresAt: Date.now() + 2 * 60 * 60 * 1000, via: 'cloud' as const };
      }
    } catch {
      /* offline or SMTP unset — use the free mail app */
    }
  }
  const account = findLocalAccount(email);
  if (!account) throw new LocalAuthError(404, 'No account uses that email on this device');
  if (channel === 'sms' && !account.phone) {
    throw new LocalAuthError(400, 'Add a phone number on Profile first, or reset by email');
  }
  const record: ResetRecord = {
    email: normalizeEmail(email),
    code: sixDigits(),
    expiresAt: Date.now() + 15 * 60 * 1000,
    channel,
  };
  writeCodes([...readCodes().filter((item) => item.email !== record.email), record]);
  const body = [
    `Empower password reset code: ${record.code}`,
    '',
    'This code expires in 15 minutes. Enter it on the sign-in screen, then choose a new password.',
    'If you did not ask for a reset, ignore this message.',
  ].join('\n');
  const to = channel === 'email' ? account.email : account.phone ?? '';
  openFreeMessage(channel, [to], 'Empower password reset', body);
  return { channel, expiresAt: record.expiresAt, via: 'device' as const };
}

export async function completePasswordReset(email: string, code: string, password: string) {
  const token = code.trim();
  if (token.length >= 20) {
    try {
      await api('/auth/password-reset/confirm', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      const needle = normalizeEmail(email);
      if (findLocalAccount(needle)) await resetLocalPassword(needle, password);
      writeCodes(readCodes().filter((item) => item.email !== needle));
      return;
    } catch {
      /* fall through to the local 6-digit code */
    }
  }
  const needle = normalizeEmail(email);
  const record = readCodes().find((item) => item.email === needle);
  if (!record || record.code !== token || record.expiresAt < Date.now()) {
    throw new LocalAuthError(400, 'That reset code is wrong or has expired');
  }
  await resetLocalPassword(needle, password);
  writeCodes(readCodes().filter((item) => item.email !== needle));
}
