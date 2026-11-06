interface CacheEntry {
  value: string;
  expiresAt: number;
}

export class ExplanationCache {
  private entries = new Map<string, CacheEntry>();

  constructor(
    private readonly maxEntries = 200,
    private readonly ttlMs = 24 * 60 * 60 * 1000,
  ) {}

  get(key: string): string | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.entries.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: string, value: string): void {
    if (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest) this.entries.delete(oldest);
    }

    this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}
