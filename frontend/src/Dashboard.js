import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [sharedTasks, setSharedTasks] = useState([]);
  const [sharedPage, setSharedPage] = useState(1);
  const [userId, setUserId] = useState(null);

  const tasksPerPage = 5;
  const token = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');

  // Busca ID do usuário logado para controle do botão excluir em compartilhadas
  useEffect(() => {
    async function fetchUserInfo() {
      if (!token || !username) return;
      try {
        const res = await fetch(`http://localhost:8000/api/users/?username=${username}`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao buscar usuário logado');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setUserId(data[0].id);
      } catch {
        setUserId(null);
      }
    }
    fetchUserInfo();
  }, [token, username]);

  async function fetchAllTasks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/tasks/?page_size=1000', {
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao buscar tarefas: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      const tasksArray = Array.isArray(data) ? data : data.results || [];
      setTasks(tasksArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSharedTasks() {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:8000/api/sharing/', {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao buscar tarefas compartilhadas');
      const shares = await res.json();

      // A API já retorna os dados completos da tarefa no campo 'task'
      const sharedTasks = shares
        .filter(share => share.task) // Filtra apenas shares que têm tarefa
        .map(share => ({
          ...share.task, // Usa os dados da tarefa que já vêm completos
          shareId: share.id,
          sharedByMe: share.task.user === userId,
        }));

      setSharedTasks(sharedTasks);
    } catch {
      setSharedTasks([]);
    }
  }

  useEffect(() => {
    if (token) {
      fetchAllTasks();
      fetchSharedTasks();
    }
  }, [token, userId]);

  async function toggleTaskCompletion(task) {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
        method: 'PATCH',
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !task.is_completed }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao atualizar tarefa: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      setTasks(prev => prev.map(t => (t.id === data.id ? data : t)));
      setSharedTasks(prev => prev.map(t => (t.id === data.id ? { ...t, ...data } : t)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleAddTask(e) {
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
        throw new Error(`Erro ao criar tarefa: ${res.status} - ${errorText}`);
      }

      await fetchAllTasks();
      setNewTaskTitle('');
      setNewTaskCategory('');
      setPendingPage(1);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteTask(id) {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });

      if (res.status !== 204) {
        const errorText = await res.text();
        throw new Error(`Erro ao excluir tarefa: ${res.status} - ${errorText}`);
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      setSharedTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  function startEditTask(task) {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskCategory(task.category || '');
  }

  async function handleEditSubmit(e) {
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
        throw new Error(`Erro ao atualizar tarefa: ${res.status} - ${errorText}`);
      }

      await fetchAllTasks();
      await fetchSharedTasks();
      setEditingTask(null);
      setNewTaskTitle('');
      setNewTaskCategory('');
    } catch (err) {
      alert(err.message);
    }
  }

  function cancelEdit() {
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskCategory('');
  }

  // Filtro por categoria
  function filterByCategory(task) {
    if (!filterCategory.trim()) return true;
    return task.category?.toLowerCase().includes(filterCategory.toLowerCase());
  }

  const filteredTasks = tasks.filter(filterByCategory);
  const pendingTasks = filteredTasks
    .filter(task => !task.is_completed)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const completedTasks = filteredTasks
    .filter(task => task.is_completed)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredSharedTasks = sharedTasks.filter(filterByCategory);

  // Paginação
  const pendingTotalPages = Math.ceil(pendingTasks.length / tasksPerPage);
  const pendingStartIndex = (pendingPage - 1) * tasksPerPage;
  const currentPendingTasks = pendingTasks.slice(pendingStartIndex, pendingStartIndex + tasksPerPage);

  const completedTotalPages = Math.ceil(completedTasks.length / tasksPerPage);
  const completedStartIndex = (completedPage - 1) * tasksPerPage;
  const currentCompletedTasks = completedTasks.slice(completedStartIndex, completedStartIndex + tasksPerPage);

  const sharedTotalPages = Math.ceil(filteredSharedTasks.length / tasksPerPage);
  const sharedStartIndex = (sharedPage - 1) * tasksPerPage;
  const currentSharedTasks = filteredSharedTasks.slice(sharedStartIndex, sharedStartIndex + tasksPerPage);

  const canGoPrevPending = pendingPage > 1;
  const canGoNextPending = pendingPage < pendingTotalPages;
  const canGoPrevCompleted = completedPage > 1;
  const canGoNextCompleted = completedPage < completedTotalPages;
  const canGoPrevShared = sharedPage > 1;
  const canGoNextShared = sharedPage < sharedTotalPages;

  // Função para buscar usuário pelo username
  async function fetchUserByUsername(username) {
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
  }

  // Compartilhar tarefa
  async function handleShareTask(task) {
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
        throw new Error(`Erro ao compartilhar: ${res.status} - ${errorText}`);
      }

      alert(`Tarefa compartilhada com ${user.username} com sucesso!`);
      await fetchSharedTasks();
    } catch (err) {
      alert(err.message);
    }
  }

  if (!token) return <p>Você precisa estar logado para ver as tarefas.</p>;
  if (loading) return <p>Carregando tarefas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total de tarefas: {tasks.length}</p>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Filtrar por categoria"
          value={filterCategory}
          onChange={e => {
            setFilterCategory(e.target.value);
            setPendingPage(1);
            setCompletedPage(1);
            setSharedPage(1);
          }}
        />
      </div>

      <form onSubmit={editingTask ? handleEditSubmit : handleAddTask}>
        <input
          type="text"
          placeholder="Título da tarefa"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoria"
          value={newTaskCategory}
          onChange={e => setNewTaskCategory(e.target.value)}
        />
        <button type="submit">{editingTask ? 'Salvar edição' : 'Adicionar'}</button>
        {editingTask && <button type="button" onClick={cancelEdit}>Cancelar</button>}
      </form>

      {/* Pendentes */}
      <section style={{ marginTop: '1rem' }}>
        <h3>Tarefas Pendentes ({pendingTasks.length})</h3>
        {pendingTasks.length === 0 ? (
          <p>Sem tarefas pendentes.</p>
        ) : (
          <>
            <ul>
              {currentPendingTasks.map(task => (
                <li key={`pending-${task.id}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleTaskCompletion(task)}
                    />{' '}
                    {task.title} {task.category && `(Categoria: ${task.category})`}
                  </label>
                  <button onClick={() => startEditTask(task)}>Editar</button>
                  <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
                  <button onClick={() => handleShareTask(task)}>Compartilhar</button>
                </li>
              ))}
            </ul>
            <div>
              <button disabled={!canGoPrevPending} onClick={() => setPendingPage(pendingPage - 1)}>Anterior</button>
              <span> Página {pendingPage} de {pendingTotalPages} </span>
              <button disabled={!canGoNextPending} onClick={() => setPendingPage(pendingPage + 1)}>Próximo</button>
            </div>
          </>
        )}
      </section>

      {/* Concluídas */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Tarefas Concluídas ({completedTasks.length})</h3>
        {completedTasks.length === 0 ? (
          <p>Sem tarefas concluídas.</p>
        ) : (
          <>
            <ul>
              {currentCompletedTasks.map(task => (
                <li key={`completed-${task.id}`} style={{ textDecoration: 'line-through' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleTaskCompletion(task)}
                      style={{ accentColor: 'red' }} // caixa marcada em vermelho
                    />{' '}
                    {task.title} {task.category && `(Categoria: ${task.category})`}
                  </label>
                  <button onClick={() => startEditTask(task)}>Editar</button>
                  <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
                  <button onClick={() => handleShareTask(task)}>Compartilhar</button>
                </li>
              ))}
            </ul>
            <div>
              <button disabled={!canGoPrevCompleted} onClick={() => setCompletedPage(completedPage - 1)}>Anterior</button>
              <span> Página {completedPage} de {completedTotalPages} </span>
              <button disabled={!canGoNextCompleted} onClick={() => setCompletedPage(completedPage + 1)}>Próximo</button>
            </div>
          </>
        )}
      </section>

      {/* Compartilhadas */}
      <section style={{ marginTop: '2rem' }}>
        <h3>Tarefas Compartilhadas ({filteredSharedTasks.length})</h3>
        {filteredSharedTasks.length === 0 ? (
          <p>Sem tarefas compartilhadas.</p>
        ) : (
          <>
            <ul>
              {currentSharedTasks.map(task => (
                <li
                  key={`shared-${task.id}`}
                  style={{
                    textDecoration: task.is_completed ? 'line-through' : 'none',
                    color: task.is_completed ? 'gray' : 'inherit',
                  }}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => toggleTaskCompletion(task)}
                      style={{ accentColor: 'red' }} // checkbox vermelho
                    />{' '}
                    {task.title} {task.category && `(Categoria: ${task.category})`}
                  </label>
                  <button onClick={() => startEditTask(task)}>Editar</button>
                  {/* Excluir só se for dono/criador */}
                  {task.user === userId && (
                    <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
                  )}
                </li>
              ))}
            </ul>
            <div>
              <button disabled={!canGoPrevShared} onClick={() => setSharedPage(sharedPage - 1)}>Anterior</button>
              <span> Página {sharedPage} de {sharedTotalPages} </span>
              <button disabled={!canGoNextShared} onClick={() => setSharedPage(sharedPage + 1)}>Próximo</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}