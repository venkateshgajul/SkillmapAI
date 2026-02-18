require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const analysisRoutes = require('./routes/analysis');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');

const app = express();

// Allow requests from the frontend. Use CLIENT_URL in the environment for strict CORS
// In absence of CLIENT_URL (e.g., quick deploy), fall back to allowing all origins so the
// hosted frontend (Netlify) can reach the API. Replace with a specific URL in production.
const corsOptions = { origin: process.env.CLIENT_URL || true, credentials: true };
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillgapmapper', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: true,
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.warn('⚠️ MongoDB connection failed (will retry):', err.message);
    // Don't exit - let server start anyway for health checks
  });

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ✓ Server running on port ${PORT}`);
  console.log(`[${timestamp}] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[${timestamp}] MongoDB: ${process.env.MONGODB_URI ? 'configured' : 'using default'}`);
  console.log(`[${timestamp}] CORS origin: ${process.env.CLIENT_URL || 'all'}`);
});
