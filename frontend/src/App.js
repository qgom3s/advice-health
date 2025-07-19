import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './Dashboard';

export default function App() {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  // Verifica se tem token salvo no localStorage quando o app carrega
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) setToken(storedToken);
  }, []);

  // Função chamada quando o login é bem sucedido (recebe o token)
  function handleLoginSuccess(token) {
    setToken(token);
    localStorage.setItem('authToken', token);
  }

  // Logout: limpa token do estado e localStorage
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
          {/* Passa o token para o Dashboard para que ele faça as requisições autenticadas */}
          <Dashboard token={token} />
        </main>
      </div>
    );
  }

  // Tela de login / registro
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
