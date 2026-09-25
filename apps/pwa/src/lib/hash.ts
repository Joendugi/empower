export function normalizeAnswer(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeAnswer(item)).join('|');
  }
  return String(value).trim().toLowerCase().split(/\s+/).join(' ');
}

export async function hashAnswer(value: unknown): Promise<string> {
  const data = new TextEncoder().encode(normalizeAnswer(value));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function matchesAnswerHash(
  value: unknown,
  hashes: string[] | undefined
): Promise<boolean> {
  if (!hashes?.length) return false;
  const hashed = await hashAnswer(value);
  if (hashes.includes(hashed)) return true;
  if (Array.isArray(value)) {
    const sorted = await hashAnswer([...value].map(String).sort());
    return hashes.includes(sorted);
  }
  return false;
}

export async function isAnswerCorrect(
  value: unknown,
  correctAnswer?: string | string[],
  hashes?: string[]
): Promise<boolean> {
  if (await matchesAnswerHash(value, hashes)) return true;
  if (correctAnswer === undefined) return false;
  if (normalizeAnswer(value) === normalizeAnswer(correctAnswer)) return true;
  if (Array.isArray(value) && Array.isArray(correctAnswer)) {
    return normalizeAnswer([...value].map(String).sort()) ===
      normalizeAnswer([...correctAnswer].map(String).sort());
  }
  return false;
}
