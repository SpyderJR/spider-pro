interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/** Short-lived in-memory cache — avoids repeating identical calls to external providers on every poll from every user. */
export class TtlCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async wrap<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) return cached;
    const value = await fn();
    this.set(key, value, ttlMs);
    return value;
  }
}

export const cache = new TtlCache();

export const TTL = {
  klines: 15_000,
  price: 30_000,
  fearGreed: 5 * 60_000,
  fearGreedHistory: 6 * 60 * 60_000,
  m2: 60 * 60_000,
  macro: 60 * 60_000,
  stablecoins: 60_000,
  tronStats: 60_000,
  bitcoinStats: 60_000,
  memeRecent: 30_000,
  memeActivity: 15_000,
  memeToken: 30_000,
  memeHolders: 2 * 60_000,
  memeTransfers: 2 * 60_000,
  memeClustering: 10 * 60_000,
  whaleList: 60_000,
  whaleDetail: 60_000,
} as const;
