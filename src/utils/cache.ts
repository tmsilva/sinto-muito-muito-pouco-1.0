interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTtlMs: number;

  constructor(defaultTtlMs: number = 60000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Retrieves a value from the cache. Returns null if expired or missing.
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Stores a value in the cache with a specified TTL.
   */
  set(key: string, value: T, ttlMs: number = this.defaultTtlMs): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    });
  }

  /**
   * Invalidates a specific key.
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clears all cached entries.
   */
  clear(): void {
    this.cache.clear();
  }
}
