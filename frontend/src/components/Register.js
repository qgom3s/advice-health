import React, { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== password2) {
      setError('As senhas não conferem... tente novamente.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/auth/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(JSON.stringify(data));
        return;
      }
      setSuccess('Usuário criado com sucesso! Faça login.');
      setUsername('');
      setPassword('');
      setPassword2('');
    } catch (err) {
      setError('Erro ao criar usuário...');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      {success && <p style={{color:'green'}}>{success}</p>}
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
      <input
        type="password"
        placeholder="Confirme a senha"
        value={password2}
        onChange={e => setPassword2(e.target.value)}
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
}
