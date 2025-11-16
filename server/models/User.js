/**
 * User Model
 * Represents a user in the chat application
 */

class User {
  constructor(id, username, socketId) {
    this.id = id;
    this.username = username;
    this.socketId = socketId;
    this.createdAt = new Date().toISOString();
    this.isOnline = true;
    this.lastSeen = new Date().toISOString();
    this.avatar = this.generateAvatar(username);
  }

  generateAvatar(username) {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DFE6E9',
      '#A29BFE',
      '#FD79A8',
    ];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];
    const initials = username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return {
      color,
      initials,
    };
  }

  updateLastSeen() {
    this.lastSeen = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      socketId: this.socketId,
      isOnline: this.isOnline,
      avatar: this.avatar,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
