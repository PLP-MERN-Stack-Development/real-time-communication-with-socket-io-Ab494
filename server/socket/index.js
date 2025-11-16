/**
 * Socket.io Server Setup
 * Initializes and configures Socket.io
 */

const socketController = require('../controllers/socketController');
const config = require('../config');

function setupSocketIO(io) {
  // Initialize rooms
  socketController.initializeRooms();

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✓ Client connected: ${socket.id}`);

    // User events
    socket.on('user_join', (username) => {
      socketController.handleUserJoin(socket, io, username);
    });

    // Message events
    socket.on('send_message', (data) => {
      socketController.handleSendMessage(socket, io, data);
    });

    socket.on('edit_message', (data) => {
      socketController.handleEditMessage(socket, io, data);
    });

    socket.on('delete_message', (data) => {
      socketController.handleDeleteMessage(socket, io, data);
    });

    socket.on('message_read', (data) => {
      socketController.handleMessageRead(socket, io, data);
    });

    // Typing indicator
    socket.on('typing', (isTyping) => {
      socketController.handleTyping(socket, io, isTyping);
    });

    // Private messaging
    socket.on('private_message', (data) => {
      socketController.handlePrivateMessage(socket, io, data);
    });

    // Room events
    socket.on('create_room', (data) => {
      socketController.handleCreateRoom(socket, io, data);
    });

    socket.on('join_room', (data) => {
      socketController.handleJoinRoom(socket, io, data);
    });

    // Reaction events
    socket.on('add_reaction', (data) => {
      socketController.handleAddReaction(socket, io, data);
    });

    // Disconnect
    socket.on('disconnect', () => {
      socketController.handleDisconnect(socket, io);
    });

    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  return io;
}

module.exports = setupSocketIO;
