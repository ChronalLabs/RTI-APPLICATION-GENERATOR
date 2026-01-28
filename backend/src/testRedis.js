require('dotenv').config();
const { getRedisClient, connectRedis, disconnectRedis, isRedisConnected } = require('./config/redis');

async function testRedis() {
  try {
    // Check if Redis is disabled
    if (process.env.REDIS_ENABLED === 'false') {
      console.log('⚠️ Redis is disabled in .env (REDIS_ENABLED=false)');
      console.log('💡 To enable Redis: Set REDIS_ENABLED=true in .env');
      console.log('✅ App will work fine without Redis - uses MongoDB directly');
      process.exit(0);
    }

    // Connect to Redis
    const connected = await connectRedis();
    
    if (!connected) {
      console.log('❌ Could not connect to Redis. Make sure Redis server is running.');
      console.log('💡 To start Redis on WSL: wsl -e redis-server --bind 0.0.0.0 --protected-mode no');
      process.exit(1);
    }

    const redisClient = getRedisClient();

    // Test basic operations
    console.log('\n🧪 Testing Redis Operations...\n');

    // SET operation
    await redisClient.set('test:key', 'Hello Redis!');
    console.log('✅ SET test:key = "Hello Redis!"');

    // GET operation
    const value = await redisClient.get('test:key');
    console.log('✅ GET test:key =', value);

    // SET with expiry (TTL)
    await redisClient.setEx('test:expiring', 60, 'This expires in 60 seconds');
    console.log('✅ SET test:expiring with 60s TTL');

    // Check TTL
    const ttl = await redisClient.ttl('test:expiring');
    console.log('✅ TTL for test:expiring:', ttl, 'seconds');

    // JSON object storage (for caching templates)
    const templateObj = {
      name: 'municipal_template',
      department: 'Municipal',
      content: 'Sample RTI template content'
    };
    await redisClient.set('template:municipal', JSON.stringify(templateObj));
    console.log('✅ Stored JSON object in Redis');

    const cachedTemplate = await redisClient.get('template:municipal');
    console.log('✅ Retrieved JSON object:', JSON.parse(cachedTemplate));

    // Clean up test keys
    await redisClient.del('test:key', 'test:expiring', 'template:municipal');
    console.log('\n🧹 Cleaned up test keys');

    console.log('\n🎉 All Redis tests passed!\n');

  } catch (error) {
    console.error('❌ Redis Test Failed:', error);
  } finally {
    await disconnectRedis();
    process.exit(0);
  }
}

testRedis();
