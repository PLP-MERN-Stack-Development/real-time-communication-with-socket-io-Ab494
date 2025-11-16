# 🔄 Real-Time Chat Application with Socket.io# Real-Time Chat Application with Socket.io



A stunning, feature-rich real-time chat application built with **React**, **Node.js/Express**, and **Socket.io**. This project demonstrates bidirectional communication, multiple chat rooms, private messaging, typing indicators, and advanced features like message reactions and read receipts.This assignment focuses on building a real-time chat application using Socket.io, implementing bidirectional communication between clients and server.



![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)## Assignment Overview

![License](https://img.shields.io/badge/license-MIT-green.svg)

![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)You will build a chat application with the following features:

1. Real-time messaging using Socket.io

## ✨ Features2. User authentication and presence

3. Multiple chat rooms or private messaging

### Core Features4. Real-time notifications

- ✅ **Real-Time Messaging** - Instant message delivery using WebSockets5. Advanced features like typing indicators and read receipts

- ✅ **User Authentication** - Simple username-based authentication

- ✅ **Online Status** - See who's online with real-time user list## Project Structure

- ✅ **Typing Indicators** - Know when others are typing

- ✅ **Message Timestamps** - Track when messages were sent```

- ✅ **Auto-Connect** - Automatic reconnection on disconnectsocketio-chat/

├── client/                 # React front-end

### Advanced Features (6+ Implemented)│   ├── public/             # Static files

- 🎯 **Multiple Chat Rooms** - Create and join different chat channels│   ├── src/                # React source code

- 💬 **Private Messaging** - Send direct messages to other users│   │   ├── components/     # UI components

- 😊 **Message Reactions** - React to messages with 6 common emojis│   │   ├── context/        # React context providers

- ✏️ **Message Editing** - Edit your sent messages in real-time│   │   ├── hooks/          # Custom React hooks

- 🗑️ **Message Deletion** - Delete your own messages instantly│   │   ├── pages/          # Page components

- 📖 **Read Receipts** - Know when messages are read│   │   ├── socket/         # Socket.io client setup

- 👥 **User Avatars** - Colorful auto-generated user avatars│   │   └── App.jsx         # Main application component

│   └── package.json        # Client dependencies

### UI/UX Features├── server/                 # Node.js back-end

- 🎨 **Modern Dark Theme** - Beautiful gradients and smooth animations│   ├── config/             # Configuration files

- 📱 **Responsive Design** - Mobile, tablet, and desktop compatible│   ├── controllers/        # Socket event handlers

- ⚡ **Smooth Animations** - Slide-in animations and transitions│   ├── models/             # Data models

- 🌙 **Dark Mode** - Easy on the eyes│   ├── socket/             # Socket.io server setup

- 💫 **Real-time Updates** - Live user count and presence│   ├── utils/              # Utility functions

│   ├── server.js           # Main server file

## 🛠️ Tech Stack│   └── package.json        # Server dependencies

└── README.md               # Project documentation

### Backend```

- **Node.js** - JavaScript runtime

- **Express.js** - Web framework## Getting Started

- **Socket.io 4.7** - Real-time communication

- **cors** - Cross-origin resource sharing1. Accept the GitHub Classroom assignment invitation

- **dotenv** - Environment variables2. Clone your personal repository that was created by GitHub Classroom

3. Follow the setup instructions in the `Week5-Assignment.md` file

### Frontend4. Complete the tasks outlined in the assignment

- **React 18** - UI library

- **Vite 5** - Modern build tool## Files Included

- **Socket.io-client 4.7** - WebSocket client

- **Tailwind CSS 3.4** - Utility-first CSS- `Week5-Assignment.md`: Detailed assignment instructions

- Starter code for both client and server:

## 📋 Project Structure  - Basic project structure

  - Socket.io configuration templates

```  - Sample components for the chat interface

real-time-communication-with-socket-io-Ab494/

├── server/## Requirements

│   ├── controllers/socketController.js  # Socket handlers (400+ lines)

│   ├── models/- Node.js (v18 or higher)

│   │   ├── User.js                      # User model- npm or yarn

│   │   ├── Message.js                   # Message model with reactions- Modern web browser

│   │   └── Room.js                      # Room model- Basic understanding of React and Express

│   ├── config/index.js                  # Settings

│   ├── utils/## Submission

│   │   ├── database.js                  # JSON persistence

│   │   └── strings.js                   # UtilitiesYour work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

│   ├── socket/index.js                  # Socket setup

│   ├── public/                          # Static client1. Complete both the client and server portions of the application

│   ├── data/                            # Persisted data2. Implement the core chat functionality

│   └── server.js3. Add at least 3 advanced features

│4. Document your setup process and features in the README.md

├── client/5. Include screenshots or GIFs of your working application

│   ├── src/6. Optional: Deploy your application and add the URLs to your README.md

│   │   ├── components/

│   │   │   ├── App.jsx## Resources

│   │   │   ├── LoginForm.jsx

│   │   │   ├── ChatRoom.jsx- [Socket.io Documentation](https://socket.io/docs/v4/)

│   │   │   ├── MessageList.jsx- [React Documentation](https://react.dev/)

│   │   │   ├── MessageComposer.jsx- [Express.js Documentation](https://expressjs.com/)

│   │   │   ├── UserList.jsx- [Building a Chat Application with Socket.io](https://socket.io/get-started/chat) 
│   │   │   └── RoomList.jsx
│   │   ├── context/SocketContext.jsx    # State management (200+ lines)
│   │   ├── main.jsx
│   │   └── index.css
│   └── index.html
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- Modern browser

### Installation & Running

```bash
# Terminal 1 - Server
cd server
npm install
npm start

# Terminal 2 - Client
cd client
npm install
npm run dev
```

**Access the app:**
- React Client: http://localhost:5173
- Static Client: http://localhost:5000

## 📖 API Endpoints

```
GET /api/messages                    # All messages
GET /api/rooms/:roomId/messages      # Room messages
GET /api/rooms                       # All rooms
GET /api/users                       # Connected users
GET /api/users/:userId               # Specific user
GET /api/health                      # Health check
```

## 🎯 Assignment Requirements - All Completed ✅

### Task 1: Project Setup ✓
- Node.js + Express server
- Socket.io configured
- React + Vite client
- Bi-directional communication

### Task 2: Core Features ✓
- Username authentication
- Global chat room
- Message timestamps
- Typing indicators
- Online status

### Task 3: Advanced Features (6+) ✓
1. Multiple chat rooms
2. Private messaging
3. Message reactions (6 emojis)
4. Message editing
5. Message deletion
6. Read receipts
7. User avatars with initials
8. Room persistence

### Task 4: Notifications ✓
- Join/leave notifications
- Typing notifications
- User list updates
- System messages

### Task 5: Performance & UX ✓
- Message pagination (50 per page)
- Reconnection logic
- Responsive design
- Error handling
- Message persistence

## 🎨 Design Highlights

- **Modern Dark Theme** with gradient backgrounds
- **Responsive Grid Layout** - Mobile to desktop
- **Smooth Animations** - Slide-in effects
- **Animated Typing Indicator** - Pulsing dots
- **Auto-generated Avatars** - Color + initials
- **Real-time Badges** - Typing and online indicators
- **Semantic HTML** - Accessible and SEO-friendly

## 🔐 Environment Variables

### Server
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client
```env
VITE_SOCKET_URL=http://localhost:5000
```

## 📦 Building for Production

```bash
cd client
npm run build
# Output: client/dist/
```

Deploy to:
- **Frontend**: Netlify, Vercel, GitHub Pages
- **Backend**: Render, Railway, Heroku, DigitalOcean

## 🧪 Development

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## 🐛 Troubleshooting

**Connection Issues:**
- Check server is running on port 5000
- Verify CORS settings
- Check browser console (F12)

**Messages Not Showing:**
- Confirm room is joined
- Check Network tab in DevTools
- Verify Socket events

**Styling Issues:**
- Clear browser cache
- Restart dev server
- Rebuild: `npm run build`

## 📚 Resources

- [Socket.io Docs v4](https://socket.io/docs/v4/)
- [React 18](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

## 📄 License

MIT License - Open source and free to use

## 👨‍💻 Author

Built for PLP MERN Stack Development - Week 5 Real-Time Communication

---

**Enjoy real-time chatting! 🚀**
