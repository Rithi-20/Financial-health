import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'signup', 'dashboard'

  useEffect(() => {
    // We check if a token exists, but we don't auto-set the view to dashboard 
    // to satisfy the requirement: "Whenever the user enter the page it should start with the login page"
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
