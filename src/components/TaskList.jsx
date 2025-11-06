export default function TaskList({ tasks, toggleTask, startEdit, deleteTask }) {
  if (tasks.length === 0) {
    return <p className="empty">Здесь пока пусто...</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.completed ? "completed" : ""}>
          <span className="task-text" onClick={() => toggleTask(task.id)}>
            {task.text}
          </span>
          <article className="actions">
            <button className="edit-btn" onClick={() => startEdit(task.id)}>
              ✎
            </button>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              ✖
            </button>
          </article>
        </li>
      ))}
    </ul>
  );
}
