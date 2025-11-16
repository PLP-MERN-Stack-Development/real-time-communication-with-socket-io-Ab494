/**
 * Socket Event Controllers
 * Handles all socket.io events
 */

const User = require('../models/User');
const Message = require('../models/Message');
const Room = require('../models/Room');
const Database = require('../utils/database');
const { generateId, sanitizeString } = require('../utils/strings');
const config = require('../config');

// In-memory storage
const users = new Map();
const rooms = new Map();
const typingUsers = new Map();
const connectedSockets = new Map();

/**
 * Initialize rooms from database
 */
function initializeRooms() {
  const savedRooms = Database.getRooms();
  savedRooms.forEach((roomData) => {
    const room = new Room(roomData.id, roomData.name, roomData.description, roomData.isPrivate);
    rooms.set(room.id, room);
  });

  // Ensure global room exists
  if (!rooms.has('global')) {
    const globalRoom = new Room('global', 'Global', 'Global chat room', false);
    rooms.set('global', globalRoom);
    Database.saveRoom(globalRoom.toJSON());
  }
}

/**
 * Handle user join event
 */
function handleUserJoin(socket, io, username) {
  if (!username || username.trim().length === 0) {
    socket.emit('error', { message: 'Username is required' });
    return;
  }

  const sanitizedUsername = sanitizeString(username).slice(0, config.user.usernameMaxLength);
  const userId = generateId();

  const user = new User(userId, sanitizedUsername, socket.id);
  users.set(socket.id, user);
  connectedSockets.set(socket.id, { userId, username: sanitizedUsername });

  // Join global room by default
  socket.join('global');
  const globalRoom = rooms.get('global');
  if (globalRoom) {
    globalRoom.addUser(userId);
  }

  // Emit user list
  const userList = Array.from(users.values()).map((u) => u.toJSON());
  io.emit('user_list', userList);

  // Emit user joined notification
  io.emit('user_joined', {
    userId,
    username: sanitizedUsername,
    avatar: user.avatar,
    timestamp: new Date().toISOString(),
  });

  console.log(`[${socket.id}] User joined: ${sanitizedUsername}`);
  socket.emit('connection_success', { userId, username: sanitizedUsername });
}

/**
 * Handle message send event
 */
function handleSendMessage(socket, io, data) {
  const user = users.get(socket.id);
  if (!user) {
    socket.emit('error', { message: 'User not authenticated' });
    return;
  }

  const messageText = sanitizeString(data.message || '');
  if (messageText.length === 0) {
    socket.emit('error', { message: 'Message cannot be empty' });
    return;
  }

  const messageId = generateId();
  const message = new Message(
    messageId,
    user.id,
    user.username,
    messageText,
    data.roomId || 'global'
  );

  // Save to database
  Database.saveMessage(message.toJSON());

  // Add to room
  const room = rooms.get(message.roomId);
  if (room) {
    room.addMessage(message);
  }

  // Broadcast message
  io.to(message.roomId).emit('receive_message', message.toJSON());

  // Stop typing indicator
  if (typingUsers.has(socket.id)) {
    typingUsers.delete(socket.id);
    broadcastTypingUsers(io);
  }

  console.log(`[${socket.id}] Message sent: ${messageText.slice(0, 50)}`);
}

/**
 * Handle typing indicator
 */
function handleTyping(socket, io, isTyping) {
  const user = users.get(socket.id);
  if (!user) return;

  if (isTyping) {
    typingUsers.set(socket.id, { userId: user.id, username: user.username });
  } else {
    typingUsers.delete(socket.id);
  }

  broadcastTypingUsers(io);
}

/**
 * Broadcast typing users to all clients
 */
function broadcastTypingUsers(io) {
  const typingList = Array.from(typingUsers.values());
  io.emit('typing_users', typingList);
}

/**
 * Handle private message
 */
function handlePrivateMessage(socket, io, data) {
  const sender = users.get(socket.id);
  if (!sender) {
    socket.emit('error', { message: 'User not authenticated' });
    return;
  }

  const messageText = sanitizeString(data.message || '');
  if (messageText.length === 0) {
    socket.emit('error', { message: 'Message cannot be empty' });
    return;
  }

  const messageId = generateId();
  const message = new Message(messageId, sender.id, sender.username, messageText, 'private');
  message.isPrivate = true;
  message.recipientId = data.recipientId;

  // Find recipient socket
  let recipientSocket = null;
  for (const [socketId, user] of users.entries()) {
    if (user.id === data.recipientId) {
      recipientSocket = socketId;
      break;
    }
  }

  if (recipientSocket) {
    // Save to database
    Database.saveMessage(message.toJSON());

    // Send to recipient
    io.to(recipientSocket).emit('private_message', message.toJSON());

    // Echo back to sender
    socket.emit('private_message', message.toJSON());

    console.log(`[${socket.id}] Private message sent to ${data.recipientId}`);
  } else {
    socket.emit('error', { message: 'Recipient not found' });
  }
}

/**
 * Handle room creation
 */
function handleCreateRoom(socket, io, data) {
  const user = users.get(socket.id);
  if (!user) {
    socket.emit('error', { message: 'User not authenticated' });
    return;
  }

  const roomId = generateId();
  const room = new Room(roomId, data.name, data.description || '', data.isPrivate || false);
  room.addUser(user.id);

  rooms.set(roomId, room);
  Database.saveRoom(room.toJSON());

  io.emit('room_created', room.toJSON());
  socket.join(roomId);

  console.log(`[${socket.id}] Room created: ${room.name}`);
  socket.emit('room_created_success', room.toJSON());
}

/**
 * Handle room join
 */
function handleJoinRoom(socket, io, data) {
  const user = users.get(socket.id);
  if (!user) {
    socket.emit('error', { message: 'User not authenticated' });
    return;
  }

  const room = rooms.get(data.roomId);
  if (!room) {
    socket.emit('error', { message: 'Room not found' });
    return;
  }

  socket.join(data.roomId);
  room.addUser(user.id);

  // Send recent messages
  const messages = room.getMessages(config.pagination.defaultLimit);
  socket.emit('load_messages', messages);

  // Notify room
  io.to(data.roomId).emit('user_joined_room', {
    userId: user.id,
    username: user.username,
    roomId: data.roomId,
  });

  console.log(`[${socket.id}] Joined room: ${room.name}`);
}

/**
 * Handle message reaction
 */
function handleAddReaction(socket, io, data) {
  const user = users.get(socket.id);
  if (!user) {
    socket.emit('error', { message: 'User not authenticated' });
    return;
  }

  const room = rooms.get(data.roomId);
  if (!room) return;

  const message = room.messages.find((m) => m.id === data.messageId);
  if (message) {
    message.addReaction(user.id, data.emoji);
    Database.updateMessage(data.messageId, { reactions: message.reactions });
    io.to(data.roomId).emit('reaction_added', {
      messageId: data.messageId,
      emoji: data.emoji,
      userId: user.id,
      reactions: message.reactions,
    });
  }
}

/**
 * Handle message deletion
 */
function handleDeleteMessage(socket, io, data) {
  const user = users.get(socket.id);
  if (!user) {
    socket.emit('error', { message: 'User not authenticated' });
    return;
  }

  const room = rooms.get(data.roomId);
  if (!room) return;

  const messageIndex = room.messages.findIndex((m) => m.id === data.messageId);
  if (messageIndex !== -1 && room.messages[messageIndex].senderId === user.id) {
    room.messages.splice(messageIndex, 1);
    Database.deleteMessage(data.messageId);
    io.to(data.roomId).emit('message_deleted', { messageId: data.messageId });
  }
}

/**
 * Handle message edit
 */
function handleEditMessage(socket, io, data) {
  const user = users.get(socket.id);
  if (!user) {
    socket.emit('error', { message: 'User not authenticated' });
    return;
  }

  const messageText = sanitizeString(data.message || '');
  if (messageText.length === 0) {
    socket.emit('error', { message: 'Message cannot be empty' });
    return;
  }

  const room = rooms.get(data.roomId);
  if (!room) return;

  const message = room.messages.find((m) => m.id === data.messageId);
  if (message && message.senderId === user.id) {
    message.message = messageText;
    message.isEdited = true;
    message.editedAt = new Date().toISOString();
    Database.updateMessage(data.messageId, { message: messageText, isEdited: true, editedAt: message.editedAt });
    io.to(data.roomId).emit('message_edited', message.toJSON());
  }
}

/**
 * Handle message read receipt
 */
function handleMessageRead(socket, io, data) {
  const user = users.get(socket.id);
  if (!user) return;

  io.to(data.roomId).emit('message_read', {
    messageId: data.messageId,
    userId: user.id,
  });
}

/**
 * Handle disconnect
 */
function handleDisconnect(socket, io) {
  const user = users.get(socket.id);
  if (!user) return;

  // Remove from rooms
  rooms.forEach((room) => {
    room.removeUser(user.id);
  });

  users.delete(socket.id);
  typingUsers.delete(socket.id);
  connectedSockets.delete(socket.id);

  const userList = Array.from(users.values()).map((u) => u.toJSON());
  io.emit('user_list', userList);

  io.emit('user_left', {
    userId: user.id,
    username: user.username,
    timestamp: new Date().toISOString(),
  });

  broadcastTypingUsers(io);

  console.log(`[${socket.id}] User disconnected: ${user.username}`);
}

/**
 * Export controller functions
 */
module.exports = {
  initializeRooms,
  handleUserJoin,
  handleSendMessage,
  handleTyping,
  broadcastTypingUsers,
  handlePrivateMessage,
  handleCreateRoom,
  handleJoinRoom,
  handleAddReaction,
  handleDeleteMessage,
  handleEditMessage,
  handleMessageRead,
  handleDisconnect,
  users,
  rooms,
  typingUsers,
};
