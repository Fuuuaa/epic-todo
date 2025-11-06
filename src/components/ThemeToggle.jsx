import { useEffect, useState } from "react";
import "../styles/ThemeToggle.css";

const ThemeToggle = ({ theme, toggleTheme }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      className={`theme-toggle ${isDark ? "dark" : "light"} ${
        mounted ? "mounted" : ""
      }`}
      onClick={toggleTheme}
      aria-label="Переключить тему"
    >
      <div className="track">
        <span className="icon sun"></span>
        <span className="icon moon"></span>
        <span className="thumb" />
      </div>
    </button>
  );
};

export default ThemeToggle;
