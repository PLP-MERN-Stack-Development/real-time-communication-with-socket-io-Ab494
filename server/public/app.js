(() => {
  const socket = io();

  const connectBtn = document.getElementById('connectBtn');
  const usernameInput = document.getElementById('username');
  const statusEl = document.getElementById('status');
  const usersList = document.getElementById('users');
  const messagesEl = document.getElementById('messages');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const typingEl = document.getElementById('typing');

  let username = '';
  let typingTimeout = null;

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString();
  };

  const addMessage = (msg) => {
    const el = document.createElement('div');
    el.className = 'message';
    if (msg.system) {
      el.classList.add('system');
      el.textContent = msg.message;
    } else {
      el.innerHTML = `<div class="meta"><strong>${msg.sender}</strong> <span class="time">${formatTime(msg.timestamp)}</span></div><div class="body">${escapeHtml(msg.message)}</div>`;
    }
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const escapeHtml = (s) => {
    return String(s).replace(/[&<>"']/g, function (m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m]; });
  };

  // Load recent messages
  fetch('/api/messages')
    .then(r => r.json())
    .then(list => {
      list.forEach(addMessage);
    })
    .catch(()=>{});

  connectBtn.addEventListener('click', () => {
    if (!usernameInput.value.trim()) return;
    username = usernameInput.value.trim();
    socket.connect();
    socket.emit('user_join', username);
    statusEl.textContent = 'Online';
    connectBtn.disabled = true;
    usernameInput.disabled = true;
  });

  sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (!text) return;
    socket.emit('send_message', { message: text });
    messageInput.value = '';
    socket.emit('typing', false);
  });

  messageInput.addEventListener('input', () => {
    socket.emit('typing', true);
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('typing', false);
    }, 800);
  });

  // Socket event handlers
  socket.on('connect', () => {
    console.log('connected', socket.id);
  });

  socket.on('disconnect', () => {
    statusEl.textContent = 'Offline';
    connectBtn.disabled = false;
    usernameInput.disabled = false;
  });

  socket.on('receive_message', (msg) => {
    addMessage(msg);
  });

  socket.on('user_list', (list) => {
    usersList.innerHTML = '';
    list.forEach(u => {
      const li = document.createElement('li');
      li.textContent = u.username;
      usersList.appendChild(li);
    });
  });

  socket.on('user_joined', (u) => {
    addMessage({ system: true, message: `${u.username} joined the chat`, timestamp: new Date().toISOString() });
  });

  socket.on('user_left', (u) => {
    addMessage({ system: true, message: `${u.username} left the chat`, timestamp: new Date().toISOString() });
  });

  socket.on('typing_users', (users) => {
    if (users && users.length) {
      typingEl.textContent = users.join(', ') + ' is typing...';
    } else {
      typingEl.textContent = '';
    }
  });
})();
