// components/Theme/ThemeProvider.jsx
import { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext({
  theme: "emerald",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  // Keep a local state so ThemeToggle doesn't break, but do NOT touch the DOM.
  const [theme, setTheme] = useState("emerald");
  const toggleTheme = () => setTheme("emerald"); // no-op

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
