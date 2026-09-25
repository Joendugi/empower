import type { TokenResponse } from '@cyberlearn/types';

export const LOCAL_USER_PREFIX = 'local-user:';
export const ACCOUNTS_KEY = 'empower-accounts';

export class LocalAuthError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export interface LocalAccount {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  preferredLanguage: 'en' | 'sw';
  accountType: 'learner' | 'educator' | 'admin';
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthPayload {
  email: string;
  password: string;
  displayName?: string;
  preferredLanguage?: 'en' | 'sw';
  accountType?: 'learner' | 'educator' | 'admin';
}

function newId() {
  return `loc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function localAccessToken(_accountId?: string) {
  const secret =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${LOCAL_USER_PREFIX}${secret}`;
}

export function isLocalUserToken(token: string | null | undefined): boolean {
  return Boolean(token?.startsWith(LOCAL_USER_PREFIX));
}

async function hashPassword(email: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`empower-v1:${email}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function readAccounts(): LocalAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: LocalAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function findLocalAccount(email: string): LocalAccount | undefined {
  const needle = normalizeEmail(email);
  return readAccounts().find((account) => account.email === needle);
}

export function toTokenResponse(account: LocalAccount): TokenResponse {
  return {
    accessToken: localAccessToken(account.id),
    tokenType: 'bearer',
    learner: {
      id: account.id,
      email: account.email,
      displayName: account.displayName,
      preferredLanguage: account.preferredLanguage,
      totalXp: 0,
      level: 1,
      isGuest: false,
    },
  };
}

export async function upsertLocalAccount(payload: AuthPayload): Promise<LocalAccount> {
  const email = normalizeEmail(payload.email);
  const passwordHash = await hashPassword(email, payload.password);
  const accounts = readAccounts();
  const existing = accounts.find((account) => account.email === email);
  const now = new Date().toISOString();

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.displayName = payload.displayName?.trim() || existing.displayName;
    existing.preferredLanguage = payload.preferredLanguage ?? existing.preferredLanguage;
    existing.accountType = payload.accountType ?? existing.accountType;
    existing.lastLoginAt = now;
    writeAccounts(accounts);
    return existing;
  }

  const created: LocalAccount = {
    id: newId(),
    email,
    passwordHash,
    displayName: payload.displayName?.trim() || email.split('@')[0] || 'Learner',
    preferredLanguage: payload.preferredLanguage ?? 'en',
    accountType: payload.accountType ?? 'learner',
    createdAt: now,
    lastLoginAt: now,
  };
  writeAccounts([...accounts, created]);
  return created;
}

export async function registerLocal(payload: AuthPayload): Promise<TokenResponse> {
  const email = normalizeEmail(payload.email);
  if (!email || !payload.password) {
    throw new LocalAuthError(400, 'Email and password are required');
  }
  if (payload.password.length < 8) {
    throw new LocalAuthError(400, 'Password must be at least 8 characters');
  }
  if (findLocalAccount(email)) {
    throw new LocalAuthError(409, 'Email already registered on this device');
  }
  const account = await upsertLocalAccount(payload);
  return toTokenResponse(account);
}

export async function loginLocal(email: string, password: string): Promise<TokenResponse> {
  const account = findLocalAccount(email);
  if (!account) {
    throw new LocalAuthError(401, 'Invalid email or password');
  }
  const passwordHash = await hashPassword(account.email, password);
  if (passwordHash !== account.passwordHash) {
    throw new LocalAuthError(401, 'Invalid email or password');
  }
  account.lastLoginAt = new Date().toISOString();
  const accounts = readAccounts().map((item) => (item.id === account.id ? account : item));
  writeAccounts(accounts);
  return toTokenResponse(account);
}

export function resumeLocalSession(email: string): TokenResponse | null {
  const account = findLocalAccount(email);
  return account ? toTokenResponse(account) : null;
}

export function updateLocalProfile(
  email: string,
  patch: { displayName?: string; preferredLanguage?: 'en' | 'sw' }
) {
  const needle = normalizeEmail(email);
  const accounts = readAccounts().map((account) =>
    account.email === needle
      ? {
          ...account,
          displayName: patch.displayName?.trim() || account.displayName,
          preferredLanguage: patch.preferredLanguage ?? account.preferredLanguage,
        }
      : account
  );
  writeAccounts(accounts);
}

export function promoteLocalAdmin(email: string) {
  const needle = normalizeEmail(email);
  const accounts = readAccounts().map((account) =>
    account.email === needle ? { ...account, accountType: 'admin' as const } : account
  );
  writeAccounts(accounts);
}

export function isLocalAdmin(email: string | null | undefined) {
  if (!email) return false;
  return findLocalAccount(email)?.accountType === 'admin';
}

export function parseAuthBody(body: BodyInit | null | undefined): AuthPayload | null {
  if (typeof body !== 'string') return null;
  try {
    const parsed = JSON.parse(body) as AuthPayload;
    if (!parsed?.email || !parsed?.password) return null;
    return parsed;
  } catch {
    return null;
  }
}
