import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./components/ThemeToggle";
import TaskList from "./components/TaskList";
import ConfirmDialog from "./components/ConfirmDialog";
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
    return saved || "light";
  });

  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [limitWarning, setLimitWarning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const inputRef = useRef(null);

  const sanitize = (str) => str.replace(/[<>"']/g, "");

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(window.__app_toast_timer);
    window.__app_toast_timer = setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const isLight = theme === "light";

    root.classList.toggle("light-theme", isLight);
    body.classList.toggle("light-theme", isLight);

    try {
      localStorage.setItem("theme", theme);
    } catch (err) {
      console.warn("Не удалось сохранить тему:", err);
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (err) {
        console.warn("Не удалось сохранить задачи:", err);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [tasks]);

  const handleInputChange = (e) => {
    const val = e.target.value;

    if (val.length <= 22) {
      setText(val);
      setLimitWarning(false);
    }

    if (val.length === 22) {
      setLimitWarning(true);
      setTimeout(() => setLimitWarning(false), 1200);
    }
  };

  const addTask = () => {
    const trimmed = sanitize(text.trim());
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

    showToast("Задача добавлена");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast("Задача удалена");
  };

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
    const trimmed = sanitize(text.trim());
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
    showToast("Изменения сохранены");
  };

  const handleClearAll = () => setShowConfirm(true);
  const confirmClearAll = () => {
    setTasks([]);
    setShowConfirm(false);
    showToast("Все задачи удалены");
  };
  const cancelClearAll = () => setShowConfirm(false);

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <main className="app">
      <section className="todo-container">
        <header className="header-inside">
          <h1 className="title">UpNext</h1>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>

        <article className="input-row">
          <input
            ref={inputRef}
            value={text}
            onChange={handleInputChange}
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
          {limitWarning && (
            <span className="limit-warning">Достигнут лимит 22 символа</span>
          )}
        </article>

        <TaskList
          tasks={tasks}
          toggleTask={toggleTask}
          startEdit={startEdit}
          deleteTask={deleteTask}
        />

        <footer className="footer">
          <span className="count">Активных задач: {activeCount}</span>
          <button className="clear-btn" onClick={handleClearAll}>
            Очистить всё
          </button>
        </footer>

        {toast && <div className="toast">{toast}</div>}

        {showConfirm && (
          <ConfirmDialog
            onCancel={cancelClearAll}
            onConfirm={confirmClearAll}
          />
        )}
      </section>
    </main>
  );
}
