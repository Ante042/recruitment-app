const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
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

app.get('/', (req, res) => {
  res.json({ message: 'Recruitment API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
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
