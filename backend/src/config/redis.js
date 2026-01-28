const { createClient } = require('redis');

let redisClient = null;
let isConnected = false;
let redisEnabled = true; // Flag to disable Redis if it keeps failing

/**
 * Create Redis client with retry strategy
 */
const createRedisClient = () => {
  // Skip if Redis URL is not set or disabled
  if (!process.env.REDIS_URL || process.env.REDIS_ENABLED === 'false') {
    console.log('⚠️ Redis disabled or URL not set - running without cache');
    redisEnabled = false;
    return null;
  }

  const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          console.log('⚠️ Redis unavailable - continuing without cache');
          redisEnabled = false;
          return false; // Stop reconnecting
        }
        const delay = Math.min(retries * 500, 2000);
        console.log(`🔄 Redis reconnecting in ${delay}ms (attempt ${retries})...`);
        return delay;
      },
      connectTimeout: 5000,
      keepAlive: 10000,
      noDelay: true
    }
  });

  client.on('error', (err) => {
    // Silently handle connection errors - app works without Redis
    if (err.code !== 'ECONNRESET' && err.code !== 'ECONNREFUSED') {
      console.error('❌ Redis Error:', err.message);
    }
    isConnected = false;
  });

  client.on('connect', () => {
    console.log('✅ Redis Connected Successfully');
  });

  client.on('ready', () => {
    console.log('✅ Redis Client Ready');
    isConnected = true;
    redisEnabled = true;
  });

  client.on('reconnecting', () => {
    isConnected = false;
  });

  client.on('end', () => {
    isConnected = false;
  });

  return client;
};

/**
 * Get Redis client (singleton)
 */
const getRedisClient = () => {
  if (!redisEnabled) return null;
  if (!redisClient) {
    redisClient = createRedisClient();
  }
  return redisClient;
};

/**
 * Check if Redis is connected and enabled
 */
const isRedisConnected = () => redisEnabled && isConnected;

/**
 * Connect to Redis
 * @returns {Promise} - Connection promise
 */
const connectRedis = async () => {
  if (!redisEnabled) {
    console.log('⚠️ Redis disabled - app will use MongoDB directly');
    return false;
  }
  
  try {
    const client = getRedisClient();
    if (client && !client.isOpen) {
      await client.connect();
    }
    return isConnected;
  } catch (error) {
    console.log('⚠️ Redis unavailable - app will use MongoDB directly');
    redisEnabled = false;
    return false;
  }
};

/**
 * Disconnect from Redis
 * @returns {Promise} - Disconnect promise
 */
const disconnectRedis = async () => {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
      console.log('Redis disconnected');
    }
  } catch (error) {
    console.error('Error disconnecting Redis:', error.message);
  }
};

module.exports = {
  getRedisClient,
  isRedisConnected,
  connectRedis,
  disconnectRedis
};
