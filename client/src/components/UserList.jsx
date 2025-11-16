import { useSocket } from '../context/SocketContext';

export const UserList = () => {
  const { users, onlineCount } = useSocket();

  return (
    <div className="card h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          Online ({onlineCount})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {users.length === 0 ? (
          <p className="text-slate-400 text-sm">No users online</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: user.avatar.color }}
              >
                {user.avatar.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <p className="text-xs text-green-400">● Online</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
