import React, { useEffect, useState } from 'react';

export default function Dashboard({ token }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar as tarefas autenticadas via API
  useEffect(() => {
    if (!token) return;

    async function fetchTasks() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('http://localhost:8000/api/tasks/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Erro ao buscar tarefas.');
        }

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [token]);

  // Função para tratar clique no botão de criar tarefa
  function handleCreateTask() {
    alert('Aqui você pode implementar a criação de tarefas.');
  }

  if (!token) {
    return <p>Você precisa estar logado para ver as tarefas.</p>;
  }

  if (loading) return <p>Carregando tarefas...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>

      {tasks.length === 0 ? (
        <p>
          Nenhuma tarefa encontrada.{' '}
          <button onClick={handleCreateTask}>Criar nova tarefa</button>
        </p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title} - {task.completed ? 'Concluída' : 'Pendente'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
