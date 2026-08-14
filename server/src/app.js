const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const venueRoutes = require('./routes/venueRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security Headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// Request Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://queueit-q4lgvst89-raven-x.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/venues', venueRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
