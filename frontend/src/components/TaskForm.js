import React from 'react';

const TaskForm = ({
  editingTask,
  newTaskTitle,
  setNewTaskTitle,
  newTaskCategory,
  setNewTaskCategory,
  handleAddTask,
  handleEditSubmit,
  cancelEdit,
}) => {
  return (
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
  );
};

export default TaskForm;