require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis, disconnectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and Redis
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();
  
  // Connect to Redis (optional - app works without it)
  await connectRedis();

  // Start server
  const server = app.listen(PORT, () => {
    console.log(`🚀 RTI-Gen server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api/v1`);
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(async () => {
      console.log('HTTP server closed');
      await disconnectRedis();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
  });

  return server;
};

startServer();

module.exports = startServer;
