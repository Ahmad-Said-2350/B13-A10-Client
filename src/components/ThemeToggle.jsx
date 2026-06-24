"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg border border-default bg-elevated ${className}`}
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-md transition-all duration-200 ${
          !isDark ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-secondary"
        }`}
        aria-label="Light mode"
        aria-pressed={!isDark}
      >
        <FiSun size={14} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-md transition-all duration-200 ${
          isDark ? "bg-surface text-primary shadow-sm" : "text-muted hover:text-secondary"
        }`}
        aria-label="Dark mode"
        aria-pressed={isDark}
      >
        <FiMoon size={14} />
      </button>
    </div>
  );

  
}
