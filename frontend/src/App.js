import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './Dashboard';

export default function App() {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) setToken(storedToken);
  }, []);

  function handleLoginSuccess(token) {
    setToken(token);
    localStorage.setItem('authToken', token);
  }

  function handleLogout() {
    setToken(null);
    localStorage.removeItem('authToken');
  }

  if (token) {
    return (
      <div>
        <header>
          <h1>Bem-vindo!</h1>
          <button onClick={handleLogout}>Sair</button>
        </header>
        <main>
          {/* Render the dashboard if the user is logged in */}
          <Dashboard token={token} />
        </main>
      </div>
    );
  }

  return (
    <div>
      {showRegister ? (
        <>
          <Register />
          <p>
            Já tem conta?{' '}
            <button onClick={() => setShowRegister(false)}>Entrar</button>
          </p>
        </>
      ) : (
        <>
          <Login onLoginSuccess={handleLoginSuccess} />
          <p>
            Não tem conta?{' '}
            <button onClick={() => setShowRegister(true)}>Registrar</button>
          </p>
        </>
      )}
    </div>
  );
}
