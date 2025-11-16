/**
 * Message Model
 * Represents a message in the chat application
 */

class Message {
  constructor(id, senderId, senderUsername, message, roomId = 'global') {
    this.id = id;
    this.senderId = senderId;
    this.senderUsername = senderUsername;
    this.message = message;
    this.roomId = roomId;
    this.timestamp = new Date().toISOString();
    this.isRead = false;
    this.reactions = {};
    this.isEdited = false;
    this.editedAt = null;
    this.isPrivate = false;
    this.recipientId = null;
  }

  markAsRead() {
    this.isRead = true;
  }

  addReaction(userId, emoji) {
    if (!this.reactions[emoji]) {
      this.reactions[emoji] = [];
    }
    if (!this.reactions[emoji].includes(userId)) {
      this.reactions[emoji].push(userId);
    }
  }

  removeReaction(userId, emoji) {
    if (this.reactions[emoji]) {
      this.reactions[emoji] = this.reactions[emoji].filter((id) => id !== userId);
      if (this.reactions[emoji].length === 0) {
        delete this.reactions[emoji];
      }
    }
  }

  toJSON() {
    return {
      id: this.id,
      senderId: this.senderId,
      senderUsername: this.senderUsername,
      message: this.message,
      roomId: this.roomId,
      timestamp: this.timestamp,
      isRead: this.isRead,
      reactions: this.reactions,
      isEdited: this.isEdited,
      editedAt: this.editedAt,
      isPrivate: this.isPrivate,
      recipientId: this.recipientId,
    };
  }
}

module.exports = Message;
