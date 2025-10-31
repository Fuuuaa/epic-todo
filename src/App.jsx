import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import "./App.css";

export default function App() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.body.classList.toggle("light-theme", theme === "light");
  }, [theme]);

  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  const addTask = () => {
    if (!text.trim()) return;
    const newTask = { id: Date.now(), text, completed: false };
    setTasks([newTask, ...tasks]);
    setText("");
  };

  const toggleTask = (id) =>
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Epic ToDo</h1>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </header>

      <div className="todo-container">
        <h1>Epic ToDo</h1>

        <div className="input-row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Введите задачу..."
          />
          <button onClick={addTask}>Добавить</button>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              <span onClick={() => toggleTask(task.id)}>{task.text}</span>
              <button onClick={() => deleteTask(task.id)}>✖</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
