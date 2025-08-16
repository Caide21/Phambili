// components/Theme/ThemeProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Keys for storage & attribute we toggle
const THEME_KEY = "theme"; // "light" | "dark"

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children, defaultTheme = "system" }) {
  const [theme, setTheme] = useState("light");

  // On mount: read stored or system preference
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(THEME_KEY) : null;
    let initial = stored;

    if (!initial || initial === "system") {
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      initial = prefersDark ? "dark" : "light";
    }

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, [defaultTheme]);

  // Whenever theme changes, sync DOM + persist
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
