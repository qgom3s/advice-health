import { useState, useEffect } from 'react';

export const useTasks = (token, userId) => {
  const [tasks, setTasks] = useState([]);
  const [sharedTasks, setSharedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/tasks/?page_size=1000', {
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao buscar tarefas: ${res.status} - ${errorText}.`);
      }
      const data = await res.json();
      const tasksArray = Array.isArray(data) ? data : data.results || [];
      setTasks(tasksArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSharedTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:8000/api/sharing/', {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao buscar tarefas compartilhadas.');
      const shares = await res.json();

      const sharedTasks = shares
        .filter(share => share.task)
        .map(share => ({
          ...share.task,
          shareId: share.id,
          sharedByMe: share.task.user === userId,
        }));

      setSharedTasks(sharedTasks);
    } catch {
      setSharedTasks([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllTasks();
      fetchSharedTasks();
    }
  }, [token, userId]);

  return {
    tasks,
    setTasks,
    sharedTasks,
    setSharedTasks,
    loading,
    error,
    fetchAllTasks,
    fetchSharedTasks,
  };
};