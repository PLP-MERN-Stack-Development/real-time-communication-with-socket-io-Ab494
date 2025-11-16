# 🚀 Setup & Installation Guide

## Prerequisites
- **Node.js v18+** - Download from https://nodejs.org/
- **npm** (comes with Node.js)
- **Git** - For version control

## Step 1: Clone & Navigate

```bash
git clone <your-repository-url>
cd real-time-communication-with-socket-io-Ab494
```

## Step 2: Server Setup

### Install dependencies
```bash
cd server
npm install
```

### Start the server
```bash
npm start
```

Expected output:
```
╔════════════════════════════════════════════╗
║  🔄 Socket.io Chat Server Running          ║
║  📍 http://localhost:5000                  ║
║  🌐 Open your browser and start chatting!  ║
╚════════════════════════════════════════════╝
```

**Server is now running on port 5000!**

## Step 3: Client Setup (New Terminal Window)

### Navigate to client directory
```bash
cd client
```

### Install dependencies
```bash
npm install
```

### Start the development server
```bash
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

**Client is now running on port 5173!**

## Step 4: Access the Chat

Open your browser to one of these URLs:

- **React Client (Recommended)**: http://localhost:5173
- **Static Client Fallback**: http://localhost:5000

## Using the Chat

1. **Join a Room**: Enter your username and click "Enter Chat"
2. **Send Messages**: Type in the message box and press Enter or click Send
3. **Create Rooms**: Click the "+" button to create a new chat room
4. **See Typing**: Watch the typing indicator when others type
5. **React to Messages**: Hover over a message and click emoji reactions
6. **View Online Users**: Check the sidebar for who's currently online

## Testing with Multiple Users

Open the chat in multiple browser tabs or windows:

```bash
# Tab 1
Open: http://localhost:5173
Username: Alice

# Tab 2
Open: http://localhost:5173
Username: Bob

# Now chat between them!
```

## Troubleshooting

### "Cannot connect to server"
- ✅ Check server is running on port 5000
- ✅ Check no firewall is blocking connections
- ✅ Check CORS is enabled in server

### "Module not found errors"
- ✅ Run `npm install` in both server and client directories
- ✅ Clear node_modules: `rm -rf node_modules` then `npm install`

### "Port already in use"
- ✅ Server: `sudo lsof -i :5000` then `kill <PID>`
- ✅ Client: Use `npm run dev -- --port 5174`

### "Messages not showing"
- ✅ Check browser console for errors (F12)
- ✅ Check Network tab - are WebSocket connections working?
- ✅ Refresh browser page

## Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (.env.local)
```
VITE_SOCKET_URL=http://localhost:5000
```

## Building for Production

### Build the client
```bash
cd client
npm run build
```

This creates a `dist` folder ready for deployment.

### Deploy Frontend
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repo
- **GitHub Pages**: Push to gh-pages branch

### Deploy Backend
- **Render**: Connect GitHub and deploy
- **Railway**: Connect GitHub and deploy
- **Heroku**: Use `git push heroku main`

## Development Commands

### Server
```bash
npm start      # Run once
npm run dev    # Run with auto-reload (nodemon)
```

### Client
```bash
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview production build
npm run lint   # Check code quality
```

## Project Structure

```
project/
├── server/
│   ├── controllers/  - Socket event handlers
│   ├── models/       - Data models (User, Message, Room)
│   ├── config/       - Configuration
│   ├── utils/        - Database & utilities
│   ├── socket/       - Socket.io setup
│   ├── public/       - Static files
│   ├── data/         - JSON database files
│   ├── server.js     - Main server
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/   - React components
│   │   ├── context/      - State management
│   │   ├── main.jsx      - Entry point
│   │   └── index.css     - Styles
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Features Checklist

- [x] Real-time messaging
- [x] User authentication
- [x] Online user list
- [x] Typing indicators
- [x] Multiple chat rooms
- [x] Private messaging
- [x] Message reactions
- [x] Message editing/deletion
- [x] Read receipts
- [x] User avatars
- [x] Responsive design
- [x] Message persistence
- [x] Auto-reconnection

## API Endpoints

```
GET /api/messages               - All messages
GET /api/rooms/:roomId/messages - Room messages
GET /api/rooms                  - All rooms
GET /api/users                  - Connected users
GET /api/users/:userId          - User details
GET /api/health                 - Health check
```

## Socket.io Events

### Send (Client → Server)
```
user_join, send_message, edit_message, delete_message
typing, private_message, create_room, join_room, add_reaction
```

### Receive (Server → Client)
```
connection_success, user_list, user_joined, user_left
receive_message, load_messages, private_message
typing_users, message_deleted, message_edited, reaction_added
```

## Performance Tips

1. **Clear browser cache** if CSS/JS changes don't show
2. **Use React DevTools** to debug components
3. **Use Socket.io DevTools** to see events in real-time
4. **Check Network tab** to see WebSocket connections
5. **Monitor console** for error messages

## Getting Help

1. Check the main README.md for feature documentation
2. Review Week5-Assignment.md for assignment details
3. Check browser console (F12) for error messages
4. Check server terminal for connection logs
5. Review code comments in components

## Next Steps

- [ ] Customize the theme colors
- [ ] Add user profiles
- [ ] Implement file sharing
- [ ] Add voice/video chat
- [ ] Deploy to production
- [ ] Add database (MongoDB)
- [ ] Implement user authentication with JWT
- [ ] Add message search

---

**Happy Chatting! 🎉**
