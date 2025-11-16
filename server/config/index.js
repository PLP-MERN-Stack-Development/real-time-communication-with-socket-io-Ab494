/**
 * Configuration
 */

module.exports = {
  // Socket.io settings
  socketio: {
    maxPayload: 1e6, // 1MB max payload
    pingInterval: 25000,
    pingTimeout: 60000,
  },

  // Message settings
  messages: {
    maxLength: 5000,
    maxPerPage: 50,
  },

  // Room settings
  rooms: {
    maxPerUser: 100,
  },

  // User settings
  user: {
    usernameMaxLength: 50,
    usernameMinLength: 2,
  },

  // Pagination settings
  pagination: {
    defaultLimit: 50,
    maxLimit: 500,
  },

  // Feature flags
  features: {
    fileUpload: true,
    reactions: true,
    readReceipts: true,
    typing: true,
    notifications: true,
  },
};
