const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const venueRoutes = require('./routes/venueRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://queuelt-q4lgvst89-raven-x.vercel.app',
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

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/venues', venueRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;
