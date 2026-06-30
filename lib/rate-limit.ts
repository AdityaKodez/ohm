import { NextResponse } from "next/server"
import { RateLimiterMemory, type RateLimiterRes } from "rate-limiter-flexible"

/**
 * In-memory per-IP rate limiter for the AI endpoints.
 *
 * Tradeoff (chosen deliberately): this lives in process memory, so counters
 * reset on cold starts and are NOT shared across serverless instances. That is
 * acceptable for the exhibition demo and keeps infra to zero. Swap in a Redis
 * store (e.g. RateLimiterRedis) if accurate distributed limits are ever needed.
 */
const limiter = new RateLimiterMemory({
  points: 10, // requests
  duration: 60, // per 60 seconds
})

/**
 * Best-effort client IP. Vercel sets `x-forwarded-for`; we take the first hop.
 * Falls back to a shared key so the limiter still degrades safely rather than
 * silently disabling itself when no IP is present (e.g. local dev).
 */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]!.trim()
  }
  return request.headers.get("x-real-ip")?.trim() || "anonymous"
}

/**
 * Consumes one point for the requester's IP. Returns a 429 `NextResponse` when
 * the limit is exceeded (with a `Retry-After` header), or `null` when the
 * request is allowed and should proceed.
 */
export async function enforceRateLimit(
  request: Request
): Promise<NextResponse | null> {
  const key = getClientIp(request)

  try {
    await limiter.consume(key)
    return null
  } catch (rejection) {
    const res = rejection as RateLimiterRes
    const retryAfterSeconds = Math.ceil((res?.msBeforeNext ?? 60_000) / 1000)

    return NextResponse.json(
      {
        error: `Too many requests. Please wait ${retryAfterSeconds}s and try again.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      }
    )
  }
}
