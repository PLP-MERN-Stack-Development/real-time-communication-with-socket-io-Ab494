import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('global');
  const [onlineCount, setOnlineCount] = useState(0);
  const [error, setError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    const newSocket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Socket event listeners
    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    newSocket.on('connection_success', (data) => {
      setCurrentUser(data);
    });

    newSocket.on('user_list', (userList) => {
      setUsers(userList);
      setOnlineCount(userList.length);
    });

    newSocket.on('user_joined', (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: user.timestamp,
        },
      ]);
    });

    newSocket.on('user_left', (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} left the chat`,
          timestamp: user.timestamp,
        },
      ]);
    });

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('load_messages', (messages) => {
      setMessages(messages.reverse());
    });

    newSocket.on('private_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('typing_users', (users) => {
      setTypingUsers(users);
    });

    newSocket.on('room_created', (room) => {
      setRooms((prev) => [...prev, room]);
    });

    newSocket.on('user_joined_room', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${data.username} joined the room`,
        },
      ]);
    });

    newSocket.on('message_deleted', (data) => {
      setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
    });

    newSocket.on('message_edited', (message) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? message : m))
      );
    });

    newSocket.on('reaction_added', (data) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === data.messageId ? { ...m, reactions: data.reactions } : m
        )
      );
    });

    newSocket.on('error', (data) => {
      setError(data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Socket event methods
  const joinChat = useCallback(
    (username) => {
      if (socket && !isConnected) {
        socket.connect();
        socket.emit('user_join', username);
      }
    },
    [socket, isConnected]
  );

  const sendMessage = useCallback(
    (message) => {
      if (socket && isConnected) {
        socket.emit('send_message', { message, roomId: currentRoom });
      }
    },
    [socket, isConnected, currentRoom]
  );

  const sendPrivateMessage = useCallback(
    (recipientId, message) => {
      if (socket && isConnected) {
        socket.emit('private_message', { recipientId, message });
      }
    },
    [socket, isConnected]
  );

  const setTyping = useCallback(
    (isTyping) => {
      if (socket && isConnected) {
        socket.emit('typing', isTyping);
      }
    },
    [socket, isConnected]
  );

  const createRoom = useCallback(
    (name, description, isPrivate) => {
      if (socket && isConnected) {
        socket.emit('create_room', { name, description, isPrivate });
      }
    },
    [socket, isConnected]
  );

  const joinRoom = useCallback(
    (roomId) => {
      if (socket && isConnected) {
        socket.emit('join_room', { roomId });
        setCurrentRoom(roomId);
        setMessages([]);
      }
    },
    [socket, isConnected]
  );

  const editMessage = useCallback(
    (messageId, message) => {
      if (socket && isConnected) {
        socket.emit('edit_message', { messageId, message, roomId: currentRoom });
      }
    },
    [socket, isConnected, currentRoom]
  );

  const deleteMessage = useCallback(
    (messageId) => {
      if (socket && isConnected) {
        socket.emit('delete_message', { messageId, roomId: currentRoom });
      }
    },
    [socket, isConnected, currentRoom]
  );

  const addReaction = useCallback(
    (messageId, emoji) => {
      if (socket && isConnected) {
        socket.emit('add_reaction', { messageId, emoji, roomId: currentRoom });
      }
    },
    [socket, isConnected, currentRoom]
  );

  const value = {
    socket,
    isConnected,
    currentUser,
    users,
    messages,
    typingUsers,
    rooms,
    currentRoom,
    onlineCount,
    error,
    joinChat,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    createRoom,
    joinRoom,
    editMessage,
    deleteMessage,
    addReaction,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
