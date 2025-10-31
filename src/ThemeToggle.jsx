import React from "react";
import "./ThemeToggle.css";

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === "dark";

  return (
    <button
      className={`theme-toggle ${isDark ? "dark" : "light"}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className="track">
        <span className="icon sun"></span>
        <span className="icon moon"></span>
        <span className="thumb" />
      </span>
    </button>
  );
};

export default ThemeToggle;
