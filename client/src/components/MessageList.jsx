import { useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

export const MessageList = ({ onMessageReaction = () => {} }) => {
  const { messages, currentUser, users } = useSocket();
  const messagesEndRef = useRef(null);
  const [selectedMessage, setSelectedMessage] = useEffect(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserInfo = (userId) => {
    return users.find((u) => u.id === userId);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const sender = getUserInfo(message.senderId);
            const isOwn = currentUser?.id === message.senderId;

            return (
              <div
                key={message.id}
                className={`flex gap-2 animate-slide-in ${isOwn ? 'justify-end' : 'justify-start'}`}
                onMouseEnter={() => setSelectedMessage(message.id)}
                onMouseLeave={() => setSelectedMessage(null)}
              >
                {!isOwn && sender && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: sender.avatar.color }}
                  >
                    {sender.avatar.initials}
                  </div>
                )}

                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                  {!isOwn && (
                    <p className="text-xs text-slate-400 mb-1">{sender?.username}</p>
                  )}

                  {message.system ? (
                    <div className="text-xs text-slate-500 italic">
                      {message.message}
                    </div>
                  ) : (
                    <>
                      <div
                        className={`message-bubble ${
                          isOwn ? 'message-sent' : 'message-received'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        {message.isEdited && (
                          <p className="text-xs opacity-75 mt-1">(edited)</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-xs text-slate-400">
                          {formatTime(message.timestamp)}
                        </p>

                        {selectedMessage === message.id && (
                          <div className="flex gap-1 bg-slate-700 rounded-full p-1">
                            {commonEmojis.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => onMessageReaction(message.id, emoji)}
                                className="text-sm hover:bg-slate-600 rounded-full p-1 transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {Object.entries(message.reactions).map(([emoji, userIds]) => (
                            <span
                              key={emoji}
                              className="bg-slate-700 rounded-full px-2 py-1 text-xs cursor-pointer hover:bg-slate-600"
                              title={userIds.join(', ')}
                            >
                              {emoji} {userIds.length}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
