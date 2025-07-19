import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');

  useEffect(() => {
    async function fetchUserInfo() {
      if (!token || !username) return;
      try {
        const res = await fetch(`http://localhost:8000/api/users/?username=${username}`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao buscar usuário logado.');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setUserId(data[0].id);
      } catch {
        setUserId(null);
      }
    }
    fetchUserInfo();
  }, [token, username]);

  return { token, username, userId };
};