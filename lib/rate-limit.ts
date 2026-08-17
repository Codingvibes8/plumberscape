export interface RateLimitOptions {
  windowMs?: number
  max?: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

const buckets = new Map<string, number[]>()
const MAX_KEYS = 10_000

export function rateLimit(
  key: string,
  { windowMs = 60_000, max = 5 }: RateLimitOptions = {}
): RateLimitResult {
  const now = Date.now()
  let timestamps = buckets.get(key) ?? []

  timestamps = timestamps.filter((t) => now - t < windowMs)

  if (timestamps.length >= max) {
    buckets.set(key, timestamps)
    const resetAt = (timestamps[0] ?? now) + windowMs
    return {
      success: false,
      limit: max,
      remaining: 0,
      resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    }
  }

  timestamps.push(now)
  buckets.set(key, timestamps)

  if (buckets.size > MAX_KEYS) {
    for (const [k, ts] of buckets) {
      if (now - ts[ts.length - 1] > windowMs) {
        buckets.delete(k)
      }
    }
  }

  return {
    success: true,
    limit: max,
    remaining: max - timestamps.length,
    resetAt: now + windowMs,
    retryAfterSeconds: 0,
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return req.headers.get("x-real-ip") ?? "unknown"
}

export function rateLimitByIp(
  req: Request,
  options: RateLimitOptions = {}
): RateLimitResult {
  return rateLimit(`ip:${getClientIp(req)}`, options)
}