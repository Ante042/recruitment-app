const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const personRoutes = require('./routes/person');
require('./model');

const app = express();

// CORS configuration - allow credentials for JWT cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

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

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Database sync
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });

module.exports = app;
