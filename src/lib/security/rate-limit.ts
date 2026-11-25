import 'server-only';

/**
 * Contact-form rate limit: Upstash REST when configured (survives cold starts),
 * else a best-effort in-memory window. reCAPTCHA stays the primary gate.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_TRACKED_KEYS = 10_000;
const REDIS_TIMEOUT_MS = 2000;

type WindowEntry = {
  count: number;
  resetAt: number;
};

type RedisConfig = {
  token: string;
  url: string;
};

type RedisCommandResponse = { error?: string; result?: unknown };

const windows = new Map<string, WindowEntry>();

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export type RateLimitOptions = {
  max?: number;
  windowMs?: number;
};

function pruneExpired(now: number): void {
  for (const [key, entry] of windows) {
    if (entry.resetAt <= now) windows.delete(key);
  }
}

/** Drops expired windows, then the oldest: never a full scan per request. */
function enforceCapacity(now: number): void {
  if (windows.size < MAX_TRACKED_KEYS) return;

  pruneExpired(now);
  while (windows.size >= MAX_TRACKED_KEYS) {
    const oldest = windows.keys().next().value;
    if (oldest === undefined) break;
    windows.delete(oldest);
  }
}

function checkInMemory(key: string, max: number, windowMs: number, now: number): RateLimitResult {
  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    if (!existing) enforceCapacity(now);
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function getRedisConfig(): RedisConfig | null {
  const url = process.env['UPSTASH_REDIS_REST_URL'] ?? process.env['KV_REST_API_URL'];
  const token = process.env['UPSTASH_REDIS_REST_TOKEN'] ?? process.env['KV_REST_API_TOKEN'];
  return url && token ? { token, url } : null;
}

/**
 * One MULTI/EXEC round trip: `INCR`, `PEXPIRE NX`, `PTTL`. The key never exists
 * without a TTL, so nothing can be blocked forever.
 */
async function checkRedis(
  config: RedisConfig,
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  const response = await fetch(`${config.url}/multi-exec`, {
    body: JSON.stringify([
      ['INCR', key],
      ['PEXPIRE', key, windowMs, 'NX'],
      ['PTTL', key],
    ]),
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Upstash request failed with status ${response.status}`);
  }

  const results = (await response.json()) as RedisCommandResponse[];
  const failed = results.find(entry => entry.error);
  if (failed) throw new Error(`Upstash command failed: ${failed.error}`);

  const count = Number(results[0]?.result);
  if (!Number.isFinite(count)) throw new Error('Upstash returned no counter');

  const ttl = Number(results[2]?.result);
  const ttlMs = Number.isFinite(ttl) && ttl > 0 ? ttl : windowMs;
  if (count > max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Never throws: a Redis failure degrades to the local window. */
export async function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const { max = MAX_REQUESTS_PER_WINDOW, windowMs = WINDOW_MS } = options;
  const config = getRedisConfig();
  if (config) {
    try {
      return await checkRedis(config, key, max, windowMs);
    } catch (error) {
      console.error('Rate limit store unavailable; falling back to in-memory', error);
    }
  }
  return checkInMemory(key, max, windowMs, Date.now());
}

export function resetRateLimit(): void {
  windows.clear();
}
