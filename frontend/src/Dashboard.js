import React, { useEffect, useState } from 'react';

export default function Dashboard({ token }) {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch('http://localhost:8000/api/tasks/', {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) throw new Error('Erro ao buscar tarefas.');

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Erro ao buscar tarefas.');
    }
  }

  async function createTask(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/api/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) throw new Error();

      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setNewTitle('');
    } catch {
      setError('Erro ao criar tarefa.');
    }
  }

  async function updateTaskStatus(task) {
    const updated = { ...task, completed: !task.completed };

    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ completed: updated.completed }),
      });

      if (!res.ok) throw new Error();

      setTasks(prev =>
        prev.map(t => (t.id === task.id ? updated : t))
      );
    } catch {
      setError('Erro ao atualizar status da tarefa.');
    }
  }

  async function deleteTask(id) {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Erro ao deletar tarefa.');
    }
  }

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={createTask}>
        <input
          type="text"
          placeholder="Nova tarefa"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      <h3>Tarefas Pendentes</h3>
      <ul>
        {pendingTasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={false}
              onChange={() => updateTaskStatus(task)}
            />
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      <h3>Tarefas Concluídas</h3>
      <ul>
        {completedTasks.map(task => (
          <li key={task.id} style={{ textDecoration: 'line-through', color: 'gray' }}>
            <input
              type="checkbox"
              checked={true}
              onChange={() => updateTaskStatus(task)}
            />
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
