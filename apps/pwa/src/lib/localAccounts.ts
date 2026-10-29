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
  accountType: 'learner' | 'educator' | 'admin' | 'owner';
  phone?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthPayload {
  email: string;
  password: string;
  displayName?: string;
  preferredLanguage?: 'en' | 'sw';
  accountType?: 'learner' | 'educator' | 'admin' | 'owner';
  phone?: string;
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

const PBKDF2_PREFIX = 'empower-v2:pbkdf2:sha256';
const PBKDF2_ITERATIONS = 210_000;

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function hashPasswordV1(email: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`empower-v1:${email}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(digest));
}

export async function hashPassword(email: string, password: string, saltHex?: string): Promise<string> {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(`${email}:${password}`),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    material,
    256
  );
  return `${PBKDF2_PREFIX}:${PBKDF2_ITERATIONS}:${bytesToHex(salt)}:${bytesToHex(new Uint8Array(bits))}`;
}

function parseV2Hash(value: string) {
  const parts = value.split(':');
  if (parts.length !== 6 || !value.startsWith(`${PBKDF2_PREFIX}:`)) return null;
  return { iterations: parts[3], salt: parts[4], digest: parts[5] };
}

async function passwordsMatch(account: LocalAccount, password: string): Promise<boolean> {
  const parsed = parseV2Hash(account.passwordHash);
  if (parsed) {
    const computed = await hashPassword(account.email, password, parsed.salt);
    return computed === account.passwordHash;
  }
  return (await hashPasswordV1(account.email, password)) === account.passwordHash;
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
    existing.accountType = email === OWNER_EMAIL ? 'owner' : (payload.accountType ?? existing.accountType);
    if (payload.phone !== undefined) existing.phone = payload.phone.trim();
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
    accountType: email === OWNER_EMAIL ? 'owner' : (payload.accountType ?? 'learner'),
    phone: payload.phone?.trim() || undefined,
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
  if (!(await passwordsMatch(account, password))) {
    throw new LocalAuthError(401, 'Invalid email or password');
  }
  if (!parseV2Hash(account.passwordHash)) {
    account.passwordHash = await hashPassword(account.email, password);
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
  patch: { displayName?: string; preferredLanguage?: 'en' | 'sw'; phone?: string }
) {
  const needle = normalizeEmail(email);
  const accounts = readAccounts().map((account) =>
    account.email === needle
      ? {
          ...account,
          displayName: patch.displayName?.trim() || account.displayName,
          preferredLanguage: patch.preferredLanguage ?? account.preferredLanguage,
          phone: patch.phone !== undefined ? patch.phone.trim() : account.phone,
        }
      : account
  );
  writeAccounts(accounts);
}

export async function resetLocalPassword(email: string, password: string) {
  const account = findLocalAccount(email);
  if (!account) throw new LocalAuthError(404, 'No account uses that email on this device');
  if (password.length < 8) throw new LocalAuthError(400, 'Password must be at least 8 characters');
  account.passwordHash = await hashPassword(account.email, password);
  const accounts = readAccounts().map((item) => (item.id === account.id ? account : item));
  writeAccounts(accounts);
}

export const OWNER_EMAIL = 'joeeroctib@gmail.com';

export function isOwner(email: string | null | undefined) {
  return normalizeEmail(email ?? '') === OWNER_EMAIL;
}

export function isStaff(email: string | null | undefined) {
  if (!email) return false;
  if (isOwner(email)) return true;
  const type = findLocalAccount(email)?.accountType;
  return type === 'admin' || type === 'owner';
}

export function isEducator(email: string | null | undefined) {
  if (!email || isStaff(email)) return false;
  return findLocalAccount(email)?.accountType === 'educator';
}

const OWNER_SEED_RETIRED_KEY = 'empower-owner-seed-retired-v1';

/**
 * Older builds seeded the owner account on every device with a password baked into the bundle.
 * Remove that local account once so the leaked password stops working; the owner then registers
 * or signs in like everyone else (through the API when it is reachable).
 */
export function retireSeededOwnerAccount() {
  if (typeof localStorage === 'undefined') return;
  try {
    if (localStorage.getItem(OWNER_SEED_RETIRED_KEY)) return;
    writeAccounts(readAccounts().filter((account) => account.email !== OWNER_EMAIL));
    localStorage.setItem(OWNER_SEED_RETIRED_KEY, new Date().toISOString());
  } catch {
    /* storage unavailable — nothing seeded to remove */
  }
}

export async function createLimitedAdmin(input: {
  email: string;
  password: string;
  displayName: string;
}) {
  const email = normalizeEmail(input.email);
  if (!email || input.password.length < 8) {
    throw new LocalAuthError(400, 'Email and an 8-character password are required');
  }
  if (email === OWNER_EMAIL) {
    throw new LocalAuthError(400, 'That account is reserved for the owner');
  }
  if (findLocalAccount(email)) {
    throw new LocalAuthError(409, 'Email already registered on this device');
  }
  await upsertLocalAccount({
    email,
    password: input.password,
    displayName: input.displayName,
    accountType: 'admin',
  });
}

export function promoteLocalAdmin(email: string) {
  if (isOwner(email)) return;
  const needle = normalizeEmail(email);
  const accounts = readAccounts().map((account) =>
    account.email === needle ? { ...account, accountType: 'admin' as const } : account
  );
  writeAccounts(accounts);
}

export function isLocalAdmin(email: string | null | undefined) {
  if (!email) return false;
  const type = findLocalAccount(email)?.accountType;
  return type === 'admin' || type === 'owner' || isOwner(email);
}

export function listLocalAccounts(): Omit<LocalAccount, 'passwordHash'>[] {
  return readAccounts().map(({ passwordHash: _secret, ...account }) => account);
}

export function setLocalAccountType(email: string, accountType: LocalAccount['accountType']) {
  const needle = normalizeEmail(email);
  const nextType: LocalAccount['accountType'] = needle === OWNER_EMAIL ? 'owner' : accountType === 'owner' ? 'admin' : accountType;
  const accounts: LocalAccount[] = readAccounts().map((account) =>
    account.email === needle ? { ...account, accountType: nextType } : account
  );
  writeAccounts(accounts);
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
