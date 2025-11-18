import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
// Diğer index.css veya App.css dosyalarını buradan import edebilirsiniz

function App() {
  const [session, setSession] = useState(null); 
  
  const handleLoginSuccess = (data) => {
    setSession(data);
  };

  const handleLogout = () => {
    setSession(null);
  };

  return (
    <div>
      {session ? (
        <Dashboard session={session} onLogout={handleLogout} />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;