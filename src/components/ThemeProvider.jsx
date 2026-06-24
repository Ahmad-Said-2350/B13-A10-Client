"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  const setTheme = (next) => {
    const value = next === "light" ? "light" : "dark";
    setThemeState(value);
    document.documentElement.classList.toggle("dark", value === "dark");
    localStorage.setItem("theme", value);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return <div className="min-h-full bg-page">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
