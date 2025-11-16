import { useSocket } from '../context/SocketContext';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { UserList } from './UserList';
import { RoomList } from './RoomList';

export const ChatRoom = ({ username }) => {
  const { isConnected, currentUser, joinRoom, addReaction } = useSocket();

  const handleRoomSelect = (roomId) => {
    joinRoom(roomId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <header className="mb-4">
          <div className="card flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                💬 Real-Time Chat
              </h1>
              <p className="text-sm text-slate-400">
                Welcome, <span className="text-cyan-400 font-semibold">{username}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isConnected ? 'bg-green-900' : 'bg-red-900'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  } animate-pulse`}
                ></span>
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 min-h-0">
          {/* Sidebar */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <RoomList onRoomSelect={handleRoomSelect} />
            <UserList />
          </div>

          {/* Chat Area */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <div className="flex-1 flex flex-col min-h-0 card p-0 overflow-hidden">
              <MessageList onMessageReaction={addReaction} />
              <MessageComposer />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center text-xs text-slate-500">
          <p>Built with React, Socket.io & Tailwind CSS 🚀</p>
        </footer>
      </div>
    </div>
  );
};
