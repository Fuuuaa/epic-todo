import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";

(() => {
  try {
    const savedTheme = localStorage.getItem("theme") || "light";
    const root = document.documentElement;

    if (savedTheme === "light") {
      root.classList.add("light-theme");
      document.body?.classList.add("light-theme");
      root.style.background = "#ffffff";
    } else {
      root.style.background = "#0f0f0f";
    }
  } catch {
    document.documentElement.style.background = "#ffffff";
  }
})();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
