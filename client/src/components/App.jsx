import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { ChatRoom } from './ChatRoom';

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLoginSuccess = (name) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ChatRoom username={username} />
      )}
    </>
  );
};

export default App;
