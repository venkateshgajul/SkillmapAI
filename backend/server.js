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

const getEnv = (key) => (process.env[key] || '').trim();

mongoose.set('bufferCommands', false);

// Allow requests from the frontend. Use CLIENT_URL in the environment for strict CORS
// In absence of CLIENT_URL (e.g., quick deploy), fall back to allowing all origins so the
// hosted frontend (Netlify) can reach the API. Replace with a specific URL in production.
const corsOptions = { origin: process.env.CLIENT_URL || true, credentials: true };
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoUri = getEnv('MONGODB_URI') ||
  (process.env.NODE_ENV === 'production' ? null : 'mongodb://localhost:27017/skillgapmapper');

let mongoConnectPromise = null;

const connectMongo = () => {
  if (!mongoUri) {
    return Promise.reject(new Error('MONGODB_URI is not set'));
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (mongoConnectPromise) {
    return mongoConnectPromise;
  }

  mongoConnectPromise = mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true
  })
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch(err => {
      console.warn('⚠️ MongoDB connection failed (will retry):', err.message);
      throw err;
    })
    .finally(() => {
      mongoConnectPromise = null;
    });

  return mongoConnectPromise;
};

if (!mongoUri) {
  console.warn('⚠️ MONGODB_URI is not set. API endpoints requiring database access will return 503.');
} else {
  connectMongo().catch(() => {
    // Don't exit - let server start anyway for health checks and retries
  });
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

const requireDbConnection = async (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }

  if (!mongoUri) {
    return res.status(503).json({
      error: 'Database is unavailable. Please try again in a moment.'
    });
  }

  if (mongoose.connection.readyState !== 1) {
    try {
      await connectMongo();
    } catch (err) {
      return res.status(503).json({
        error: 'Database is unavailable. Please try again in a moment.'
      });
    }
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database is unavailable. Please try again in a moment.'
    });
  }

  next();
};

app.use('/api', requireDbConnection);

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date(),
  dbState: mongoose.connection.readyState
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ✓ Server running on port ${PORT}`);
  console.log(`[${timestamp}] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[${timestamp}] MongoDB: ${getEnv('MONGODB_URI') ? 'configured' : 'using default'}`);
  console.log(`[${timestamp}] CORS origin: ${process.env.CLIENT_URL || 'all'}`);
});
