import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Resilient Redis client with auto-reconnect and graceful offline fallback
export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 3) {
      return null; // Stop reconnecting after 3 tries in local dev without Redis
    }
    return Math.min(times * 100, 2000);
  },
  enableOfflineQueue: false,
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis cache');
});

redis.on('error', (err) => {
  // Silent warning in local dev so development continues seamlessly without local Redis installed
  console.warn('⚠️  Redis connection warning (falling back to memory cache):', err.message);
});

