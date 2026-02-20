const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const personRoutes = require('./routes/person');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./util/logger');
require('./model');

/**
 * Configured Express application with middleware, routes and error handling.
 * @type {import('express').Application}
 */
const app = express();

// CORS configuration - allow credentials for JWT cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/person', personRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Recruitment API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Test routes (development only)
if (process.env.NODE_ENV !== 'production') {
  const testRoutes = require('./routes/test');
  app.use('/api/test', testRoutes);
}

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

module.exports = app;
