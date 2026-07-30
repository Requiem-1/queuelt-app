require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create HTTP server & initialize Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  },
});

// Store io instance on app for controller usage
app.set('io', io);

// Socket.io Connection Listener
io.on('connection', (socket) => {
  console.log(`[socket.io]: Client connected: ${socket.id}`);

  socket.on('join:room', (room) => {
    socket.join(room);
    console.log(`[socket.io]: Socket ${socket.id} joined room '${room}'`);
  });

  socket.on('disconnect', () => {
    console.log(`[socket.io]: Client disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`[server]: Server running on port ${PORT}`);
});
