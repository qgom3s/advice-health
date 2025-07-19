import { useState } from 'react';

export const useTaskActions = (token, fetchAllTasks, fetchSharedTasks, setTasks, setSharedTasks) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const toggleTaskCompletion = async (task) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
        method: 'PATCH',
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !task.is_completed }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao atualizar tarefa: ${res.status} - ${errorText}.`);
      }

      const data = await res.json();
      setTasks(prev => prev.map(t => (t.id === data.id ? data : t)));
      setSharedTasks(prev => prev.map(t => (t.id === data.id ? { ...t, ...data } : t)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return alert('O título não pode ser vazio.');

    try {
      const res = await fetch('http://localhost:8000/api/tasks/', {
        method: 'POST',
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, category: newTaskCategory, is_completed: false }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao criar tarefa: ${res.status} - ${errorText}.`);
      }

      await fetchAllTasks();
      setNewTaskTitle('');
      setNewTaskCategory('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });

      if (res.status !== 204) {
        const errorText = await res.text();
        throw new Error(`Erro ao excluir tarefa: ${res.status} - ${errorText}.`);
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      setSharedTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const startEditTask = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskCategory(task.category || '');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return alert('O título não pode ser vazio.');

    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${editingTask.id}/`, {
        method: 'PUT',
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          category: newTaskCategory,
          is_completed: editingTask.is_completed,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao atualizar tarefa: ${res.status} - ${errorText}.`);
      }

      await fetchAllTasks();
      await fetchSharedTasks();
      cancelEdit();
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskCategory('');
  };

  const fetchUserByUsername = async (username) => {
    try {
      const res = await fetch(`http://localhost:8000/api/users/?username=${username}`, {
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data[0];
      return null;
    } catch {
      return null;
    }
  };

  const handleShareTask = async (task) => {
    const username = prompt('Digite o username do usuário para compartilhar esta tarefa:');
    if (!username || !username.trim()) return;

    const user = await fetchUserByUsername(username.trim());
    if (!user) {
      alert('Usuário não encontrado.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/sharing/', {
        method: 'POST',
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: task.id, user_id: user.id }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao compartilhar: ${res.status} - ${errorText}.`);
      }

      alert(`Tarefa compartilhada com ${user.username} com sucesso!`);
      await fetchSharedTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  return {
    newTaskTitle,
    setNewTaskTitle,
    newTaskCategory,
    setNewTaskCategory,
    editingTask,
    toggleTaskCompletion,
    handleAddTask,
    handleDeleteTask,
    startEditTask,
    handleEditSubmit,
    cancelEdit,
    handleShareTask,
  };
};