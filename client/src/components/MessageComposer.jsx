import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

export const MessageComposer = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, setTyping, typingUsers } = useSocket();
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      setTyping(true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTyping(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage(message);
    setMessage('');
    setIsTyping(false);
    setTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-slate-800 border-t border-slate-700 p-4 rounded-b-lg">
      {typingUsers.length > 0 && (
        <div className="mb-2 text-xs text-slate-400">
          <span className="inline-block">
            {typingUsers.map((u) => u.username).join(', ')}{' '}
            {typingUsers.length === 1 ? 'is' : 'are'} typing
          </span>
          <span className="ml-1">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message... (Shift+Enter for new line)"
          className="input-field resize-none min-h-10 max-h-32"
          rows="1"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="btn-primary flex-shrink-0 h-10 flex items-center disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};
