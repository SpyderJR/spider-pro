export const DAILY_CHAT_LIMIT = 15;
const DAY_MS = 24 * 60 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * In-memory per-IP counter — zero infra cost, no database. Resets whenever the
 * function's container cold-starts (Netlify Functions don't guarantee a warm
 * instance across requests), so this is a best-effort second layer, not a hard
 * guarantee — the client-side localStorage counter is the primary defense and
 * survives across cold starts for a given browser.
 */
const counters = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export function checkChatRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = counters.get(ip);

  if (!entry || now > entry.resetAt) {
    counters.set(ip, { count: 1, resetAt: now + DAY_MS });
    return { allowed: true, remaining: DAILY_CHAT_LIMIT - 1 };
  }

  if (entry.count >= DAILY_CHAT_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: DAILY_CHAT_LIMIT - entry.count };
}
