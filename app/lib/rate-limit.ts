// Simple in-memory rate limiter for API routes
// For production at scale, use Redis (Upstash) — this handles low-medium traffic well

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  });
}, 5 * 60 * 1000);

interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  max: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check rate limit for a given identifier (IP, user ID, etc.)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    store.set(key, {
      count: 1,
      resetTime: now + config.windowSeconds * 1000,
    });
    return { success: true, remaining: config.max - 1, resetIn: config.windowSeconds };
  }

  if (entry.count >= config.max) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    return { success: false, remaining: 0, resetIn };
  }

  entry.count++;
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);
  return { success: true, remaining: config.max - entry.count, resetIn };
}

/**
 * Extract client IP from request headers (works on Vercel)
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  return 'unknown';
}

// Preset rate limit configurations
export const RATE_LIMITS = {
  auth: { max: 5, windowSeconds: 300 },         // 5 attempts per 5 minutes
  contact: { max: 3, windowSeconds: 600 },       // 3 submissions per 10 minutes
  chat: { max: 30, windowSeconds: 60 },           // 30 messages per minute
  api: { max: 60, windowSeconds: 60 },            // 60 requests per minute
  passwordReset: { max: 3, windowSeconds: 900 },  // 3 resets per 15 minutes
} as const;
