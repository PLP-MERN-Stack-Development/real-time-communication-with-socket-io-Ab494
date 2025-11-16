/**
 * Room Model
 * Represents a chat room in the application
 */

class Room {
  constructor(id, name, description = '', isPrivate = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isPrivate = isPrivate;
    this.createdAt = new Date().toISOString();
    this.users = [];
    this.messages = [];
    this.maxMessages = 500;
  }

  addUser(userId) {
    if (!this.users.includes(userId)) {
      this.users.push(userId);
    }
  }

  removeUser(userId) {
    this.users = this.users.filter((id) => id !== userId);
  }

  addMessage(message) {
    this.messages.push(message);
    // Keep only the last maxMessages
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
  }

  getMessages(limit = 50, offset = 0) {
    return this.messages.slice(Math.max(0, this.messages.length - limit - offset), this.messages.length - offset).reverse();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isPrivate: this.isPrivate,
      createdAt: this.createdAt,
      userCount: this.users.length,
      messageCount: this.messages.length,
    };
  }
}

module.exports = Room;
