import { useSocket } from '../context/SocketContext';

export const RoomList = ({ onRoomSelect }) => {
  const { rooms, currentRoom, createRoom } = useSocket();
  const [showCreateForm, setShowCreateForm] = null;
  const [roomName, setRoomName] = null;

  const defaultRooms = [
    { id: 'global', name: '# Global', icon: '🌍' },
    { id: 'announcements', name: '📢 Announcements', icon: '' },
    { id: 'random', name: '🎲 Random', icon: '' },
  ];

  const handleCreateRoom = () => {
    if (!roomName?.trim()) return;
    createRoom(roomName, '', false);
    setRoomName('');
    setShowCreateForm(false);
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Channels</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="text-lg hover:bg-slate-700 p-1 rounded transition-colors"
        >
          +
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-4 p-3 bg-slate-700 rounded-lg space-y-2">
          <input
            type="text"
            placeholder="Room name"
            value={roomName || ''}
            onChange={(e) => setRoomName(e.target.value)}
            className="input-field text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateRoom}
              className="btn-primary flex-1 text-sm"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="btn-secondary flex-1 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {defaultRooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              currentRoom === room.id
                ? 'bg-cyan-500 text-white'
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            {room.name}
          </button>
        ))}

        {rooms.length > 0 && (
          <>
            <hr className="border-slate-700 my-2" />
            <p className="text-xs text-slate-500 px-3 py-2">Custom Rooms</p>
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onRoomSelect(room.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  currentRoom === room.id
                    ? 'bg-cyan-500 text-white'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
                title={room.description}
              >
                # {room.name}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
