// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import setup and utilities
const setupSocketIO = require('./socket');
const Database = require('./utils/database');
const socketController = require('./controllers/socketController');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  maxPayload: 1e6, // 1MB max payload
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
Database.initialize();

// Setup Socket.io
setupSocketIO(io);

// API Routes

// Get all messages
app.get('/api/messages', (req, res) => {
  const messages = Database.getMessages();
  res.json(messages);
});

// Get messages for a specific room
app.get('/api/rooms/:roomId/messages', (req, res) => {
  const { roomId } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;
  
  const messages = Database.getMessagesByRoom(roomId, limit, offset);
  res.json(messages);
});

// Get all rooms
app.get('/api/rooms', (req, res) => {
  const rooms = Array.from(socketController.rooms.values()).map((r) => r.toJSON());
  res.json(rooms);
});

// Get connected users
app.get('/api/users', (req, res) => {
  const users = Array.from(socketController.users.values()).map((u) => u.toJSON());
  res.json(users);
});

// Get user by ID
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  let user = null;
  
  for (const u of socketController.users.values()) {
    if (u.id === userId) {
      user = u.toJSON();
      break;
    }
  }
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    users: socketController.users.size,
    rooms: socketController.rooms.size,
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Real-Time Chat Server is running. Open http://localhost:5000 to chat.');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🔄 Socket.io Chat Server Running          ║
║  📍 http://localhost:${PORT}                  ║
║  🌐 Open your browser and start chatting!   ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io }; 