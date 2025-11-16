/**
 * Database Utility
 * Simple JSON-based persistence layer for messages and rooms
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
  /**
   * Initialize database files if they don't exist
   */
  static initialize() {
    if (!fs.existsSync(MESSAGES_FILE)) {
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(ROOMS_FILE)) {
      const defaultRooms = [
        {
          id: 'global',
          name: 'Global',
          description: 'Global chat room',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'announcements',
          name: 'Announcements',
          description: 'Important announcements',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'random',
          name: 'Random',
          description: 'Off-topic discussions',
          isPrivate: false,
          createdAt: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(ROOMS_FILE, JSON.stringify(defaultRooms, null, 2));
    }
  }

  /**
   * Save a message to the database
   */
  static saveMessage(message) {
    try {
      const messages = this.getMessages();
      messages.push(message);
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
      return true;
    } catch (err) {
      console.error('Error saving message:', err);
      return false;
    }
  }

  /**
   * Get all messages
   */
  static getMessages() {
    try {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading messages:', err);
      return [];
    }
  }

  /**
   * Get messages for a specific room
   */
  static getMessagesByRoom(roomId, limit = 50, offset = 0) {
    try {
      const messages = this.getMessages();
      const roomMessages = messages.filter((m) => m.roomId === roomId);
      return roomMessages.slice(Math.max(0, roomMessages.length - limit - offset), roomMessages.length - offset);
    } catch (err) {
      console.error('Error getting room messages:', err);
      return [];
    }
  }

  /**
   * Delete a message from the database
   */
  static deleteMessage(messageId) {
    try {
      let messages = this.getMessages();
      messages = messages.filter((m) => m.id !== messageId);
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
      return true;
    } catch (err) {
      console.error('Error deleting message:', err);
      return false;
    }
  }

  /**
   * Update a message in the database
   */
  static updateMessage(messageId, updates) {
    try {
      const messages = this.getMessages();
      const index = messages.findIndex((m) => m.id === messageId);
      if (index !== -1) {
        messages[index] = { ...messages[index], ...updates, editedAt: new Date().toISOString() };
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
        return messages[index];
      }
      return null;
    } catch (err) {
      console.error('Error updating message:', err);
      return null;
    }
  }

  /**
   * Get all rooms
   */
  static getRooms() {
    try {
      const data = fs.readFileSync(ROOMS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading rooms:', err);
      return [];
    }
  }

  /**
   * Save a room to the database
   */
  static saveRoom(room) {
    try {
      const rooms = this.getRooms();
      const existing = rooms.findIndex((r) => r.id === room.id);
      if (existing !== -1) {
        rooms[existing] = room;
      } else {
        rooms.push(room);
      }
      fs.writeFileSync(ROOMS_FILE, JSON.stringify(rooms, null, 2));
      return true;
    } catch (err) {
      console.error('Error saving room:', err);
      return false;
    }
  }

  /**
   * Clear all data (for testing/reset)
   */
  static clearAll() {
    try {
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
      fs.writeFileSync(ROOMS_FILE, JSON.stringify([], null, 2));
      return true;
    } catch (err) {
      console.error('Error clearing data:', err);
      return false;
    }
  }
}

module.exports = Database;
