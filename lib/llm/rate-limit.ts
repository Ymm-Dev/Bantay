const buckets = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000,
): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((time) => now - time < windowMs);

  if (hits.length >= limit) {
    const retryAfterMs = windowMs - (now - hits[0]);
    buckets.set(key, hits);
    return { ok: false, retryAfterMs };
  }

  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, retryAfterMs: 0 };
}
