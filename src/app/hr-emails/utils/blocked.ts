const BLOCKED_COMPANY_PATTERNS = [/ultahost/i, /\bulta\b/i] as const;

export function isBlockedCompany(name: string): boolean {
  const value = name.trim();
  if (!value) return false;
  return BLOCKED_COMPANY_PATTERNS.some((pattern) => pattern.test(value));
}
