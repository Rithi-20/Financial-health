import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'signup', 'dashboard'

  useEffect(() => {
    // Check for existing session in sessionStorage (survives refresh, dies on close)
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setView('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setView('dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    setView('login');
  };

  if (view === 'login') {
    return <Login onLogin={handleLogin} onSwitchToSignup={() => setView('signup')} />;
  }

  if (view === 'signup') {
    return <Signup onSignupSuccess={() => setView('login')} onSwitchToLogin={() => setView('login')} />;
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Dashboard user={user} onLogout={handleLogout} />
    </div>
  );
}

export default App;
