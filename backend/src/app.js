const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const rtiRoutes = require('./routes/rti.routes');
const questionRoutes = require('./routes/question.routes');
const templateRoutes = require('./routes/template.routes');

// Import middleware
const { errorHandler, notFound } = require('./middlewares/error.middleware');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'RTI-Gen API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/rti', rtiRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/graph', require('./routes/graph.routes'));

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
