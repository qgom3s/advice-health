import React from 'react';

const TaskList = ({
  tasks,
  title,
  count,
  isCompleted = false,
  isShared = false,
  userId,
  toggleTaskCompletion,
  startEditTask,
  handleDeleteTask,
  handleShareTask,
}) => {
  if (tasks.length === 0) {
    return (
      <section style={{ marginTop: isShared ? '2rem' : '1rem' }}>
        <h3>{title} ({count})</h3>
        <p>Sem {title.toLowerCase()}.</p>
      </section>
    );
  }

  return (
    <section style={{ marginTop: isShared ? '2rem' : '1rem' }}>
      <h3>{title} ({count})</h3>
      <ul>
        {tasks.map(task => (
          <li
            key={`${isShared ? 'shared' : isCompleted ? 'completed' : 'pending'}-${task.id}`}
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
                style={{ accentColor: task.is_completed ? 'red' : 'initial' }}
              />{' '}
              {task.title} {task.category && `(Categoria: ${task.category})`}
            </label>
            <button onClick={() => startEditTask(task)}>Editar</button>
            {(!isShared || task.user === userId) && (
              <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
            )}
            {!isShared && (
              <button onClick={() => handleShareTask(task)}>Compartilhar</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TaskList;