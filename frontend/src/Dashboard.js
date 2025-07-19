import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { useTaskActions } from './hooks/useTaskActions';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Pagination from './components/Pagination';

export default function Dashboard() {
  const [filterCategory, setFilterCategory] = useState('');
  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [sharedPage, setSharedPage] = useState(1);

  const { token, userId } = useAuth();
  const {
    tasks,
    setTasks,
    sharedTasks,
    setSharedTasks,
    loading,
    error,
    fetchAllTasks,
    fetchSharedTasks,
  } = useTasks(token, userId);

  const {
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
  } = useTaskActions(token, fetchAllTasks, fetchSharedTasks, setTasks, setSharedTasks);

  const tasksPerPage = 5;

  // Filtro por categoria
  const filterByCategory = (task) => {
    if (!filterCategory.trim()) return true;
    return task.category?.toLowerCase().includes(filterCategory.toLowerCase());
  };

  const filteredTasks = tasks.filter(filterByCategory);
  const pendingTasks = filteredTasks
    .filter(task => !task.is_completed)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const completedTasks = filteredTasks
    .filter(task => task.is_completed)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredSharedTasks = sharedTasks.filter(filterByCategory);

  // Paginação
  const getPaginatedTasks = (taskList, page) => {
    const totalPages = Math.ceil(taskList.length / tasksPerPage);
    const startIndex = (page - 1) * tasksPerPage;
    const currentTasks = taskList.slice(startIndex, startIndex + tasksPerPage);
    const canGoPrev = page > 1;
    const canGoNext = page < totalPages;
    
    return { currentTasks, totalPages, canGoPrev, canGoNext };
  };

  const pendingPagination = getPaginatedTasks(pendingTasks, pendingPage);
  const completedPagination = getPaginatedTasks(completedTasks, completedPage);
  const sharedPagination = getPaginatedTasks(filteredSharedTasks, sharedPage);

  const resetPages = () => {
    setPendingPage(1);
    setCompletedPage(1);
    setSharedPage(1);
  };

  const enhancedHandleAddTask = async (e) => {
    await handleAddTask(e);
    setPendingPage(1);
  };

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
            resetPages();
          }}
        />
      </div>

      <TaskForm
        editingTask={editingTask}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newTaskCategory={newTaskCategory}
        setNewTaskCategory={setNewTaskCategory}
        handleAddTask={enhancedHandleAddTask}
        handleEditSubmit={handleEditSubmit}
        cancelEdit={cancelEdit}
      />

      <TaskList
        tasks={pendingPagination.currentTasks}
        title="Tarefas Pendentes"
        count={pendingTasks.length}
        toggleTaskCompletion={toggleTaskCompletion}
        startEditTask={startEditTask}
        handleDeleteTask={handleDeleteTask}
        handleShareTask={handleShareTask}
        userId={userId}
      />
      {pendingTasks.length > 0 && (
        <Pagination
          currentPage={pendingPage}
          totalPages={pendingPagination.totalPages}
          onPageChange={setPendingPage}
          canGoPrev={pendingPagination.canGoPrev}
          canGoNext={pendingPagination.canGoNext}
        />
      )}

      <TaskList
        tasks={completedPagination.currentTasks}
        title="Tarefas Concluídas"
        count={completedTasks.length}
        isCompleted={true}
        toggleTaskCompletion={toggleTaskCompletion}
        startEditTask={startEditTask}
        handleDeleteTask={handleDeleteTask}
        handleShareTask={handleShareTask}
        userId={userId}
      />
      {completedTasks.length > 0 && (
        <Pagination
          currentPage={completedPage}
          totalPages={completedPagination.totalPages}
          onPageChange={setCompletedPage}
          canGoPrev={completedPagination.canGoPrev}
          canGoNext={completedPagination.canGoNext}
        />
      )}

      <TaskList
        tasks={sharedPagination.currentTasks}
        title="Tarefas Compartilhadas"
        count={filteredSharedTasks.length}
        isShared={true}
        toggleTaskCompletion={toggleTaskCompletion}
        startEditTask={startEditTask}
        handleDeleteTask={handleDeleteTask}
        userId={userId}
      />
      {filteredSharedTasks.length > 0 && (
        <Pagination
          currentPage={sharedPage}
          totalPages={sharedPagination.totalPages}
          onPageChange={setSharedPage}
          canGoPrev={sharedPagination.canGoPrev}
          canGoNext={sharedPagination.canGoNext}
        />
      )}
    </div>
  );
}