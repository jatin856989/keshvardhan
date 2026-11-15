/**
 * Small in-memory sliding-window rate limiter. Good enough for a single
 * instance or low traffic. On serverless each instance has its own map, so
 * treat this as a first line of defence, not a guarantee. Swap for Upstash or
 * a database-backed limiter when traffic grows.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const windowStart = now - windowMs;
  const hits = (buckets.get(key) ?? []).filter((t) => t > windowStart);
  if (hits.length >= limit) {
    const retryAfterMs = hits[0] + windowMs - now;
    buckets.set(key, hits);
    return { ok: false, remaining: 0, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 10_000) {
    // crude memory guard
    for (const [k, v] of buckets) {
      if (v.every((t) => t <= windowStart)) buckets.delete(k);
    }
  }
  return { ok: true, remaining: limit - hits.length, retryAfterSeconds: 0 };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
