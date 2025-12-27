console.log('🔥 CONFIRMED: server/index.js is running (clean build)');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || '*'
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  req.id = requestId;

  console.log(`[${requestId}] 📨 INCOMING: ${req.method} ${req.path}`);

  // Set a global timeout for the request (2 minutes - less than Axios 3min)
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      console.error(`[${requestId}] ⚠️ GLOBAL TIMEOUT REACHED (120s)`);
      res.status(504).json({
        success: false,
        error: "The request took too long to process. Please try again.",
        requestId
      });
    }
  }, 120000);

  res.on('finish', () => {
    clearTimeout(timeoutId);
    const duration = Date.now() - start;
    console.log(`[${requestId}] 🏁 FINISHED: ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  res.on('close', () => {
    clearTimeout(timeoutId);
  });

  next();
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const reflectionRoutes = require('./routes/reflectionRoutes');
const spiritualRoutes = require('./routes/spiritualRoutes');
const gitaRoutes = require('./routes/gitaRoutes');
const { router: guidanceRoutes, preload: preloadGuidance } = require('./routes/guidanceRoutes');

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/reflections', reflectionRoutes);
app.use('/api/spiritual', spiritualRoutes);
app.use('/api/gita', gitaRoutes);
app.use('/api/guidance', guidanceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Sarthi API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/users',
      'POST /api/spiritual/ask',
      'GET /api/gita/chapters',
      'POST /api/guidance/ask'
    ]
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  // Log error details
  console.error('❌ Error occurred:');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Build error response
  const errorResponse = {
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong',
    timestamp: new Date().toISOString()
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.path = req.path;
    errorResponse.method = req.method;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    errorResponse.statusCode = 400;
    errorResponse.details = err.details;
  } else if (err.name === 'UnauthorizedError') {
    errorResponse.statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    errorResponse.statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    errorResponse.statusCode = 404;
  }

  res.status(statusCode).json(errorResponse);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Preload data and start server
const startServer = async () => {
  try {
    await preloadGuidance();
    app.listen(PORT, () => {
      console.log(`🚀 Sarthi server is running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('💥 FAILED TO START SERVER:', err.message);
    process.exit(1);
  }
};

startServer();
