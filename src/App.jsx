import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import "./styles/App.css";
import "./styles/responsive.css";

export default function App() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved : "light";
  });

  const [editingId, setEditingId] = useState(null);
  const inputRef = useRef(null);

  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === "light") {
      root.classList.add("light-theme");
      body.classList.add("light-theme");
    } else {
      root.classList.remove("light-theme");
      body.classList.remove("light-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const addTask = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (trimmed.length > 22) {
      showToast("Ограничение: максимум 22 символа");
      return;
    }

    const newTask = { id: Date.now(), text: trimmed, completed: false };
    setTasks((prev) => [newTask, ...prev]);
    setText("");

    requestAnimationFrame(() => {
      const first = document.querySelector(".task-list li:first-child");
      if (first && !first.classList.contains("added")) {
        first.classList.add("added");
        first.addEventListener(
          "animationend",
          () => first.classList.remove("added"),
          { once: true }
        );
      }
    });
  };

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const startEdit = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setEditingId(id);
      setText(task.text);
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(
            task.text.length,
            task.text.length
          );
        }
      });
    }
  };

  const saveEdit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (trimmed.length > 22) {
      showToast("Ограничение: максимум 22 символа");
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, text: trimmed } : t))
    );
    setEditingId(null);
    setText("");
  };

  const handleClearAll = () => setShowConfirm(true);
  const confirmClearAll = () => {
    setTasks([]);
    setShowConfirm(false);
  };
  const cancelClearAll = () => setShowConfirm(false);

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <main className="app">
      <section className="todo-container">
        <header className="header-inside">
          <h1 className="title">EpicToDo</h1>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>

        <article className="input-row">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (editingId ? saveEdit() : addTask())
            }
            placeholder={
              editingId ? "Редактировать задачу..." : "Введите задачу..."
            }
          />
          <button onClick={editingId ? saveEdit : addTask}>
            {editingId ? "Сохранить" : "Добавить"}
          </button>
        </article>

        {tasks.length === 0 ? (
          <p className="empty">Здесь пока пусто...</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? "completed" : ""}>
                <span className="task-text" onClick={() => toggleTask(task.id)}>
                  {task.text}
                </span>
                <article className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => startEdit(task.id)}
                  >
                    ✎
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    ✖
                  </button>
                </article>
              </li>
            ))}
          </ul>
        )}

        <footer className="footer">
          <span className="count">Активных задач: {activeCount}</span>
          <button className="clear-btn" onClick={handleClearAll}>
            Очистить всё
          </button>
        </footer>

        {toast && <div className="toast">{toast}</div>}

        {showConfirm && (
          <section className="confirm-overlay" onClick={cancelClearAll}>
            <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
              <p>Удалить все задачи?</p>
              <div className="confirm-actions">
                <button className="btn-cancel" onClick={cancelClearAll}>
                  Отмена
                </button>
                <button className="btn-delete" onClick={confirmClearAll}>
                  Удалить
                </button>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
