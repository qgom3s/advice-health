import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/auth/token/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        throw new Error('Login failed!');
      }
      const data = await res.json();
      onLoginSuccess(data.auth_token); // Pass the token to the parent component
    } catch (err) {
      setError('Usuário ou senha inválidos... tente novamente.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
