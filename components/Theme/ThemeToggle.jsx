// components/Theme/ThemeToggle.jsx
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ size = "sm", className = "" }) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-3.5 py-2.5 text-base",
  }[size];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        "inline-flex items-center justify-center rounded-md font-medium border transition-colors",
        "border-emerald-200/60 hover:border-emerald-300/80 text-emerald-800 hover:text-emerald-900",
        "dark:text-emerald-100 dark:hover:text-white dark:border-emerald-800/60 dark:hover:border-emerald-700/80",
        sizeClasses,
        className,
      ].join(" ")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="mr-1.5" aria-hidden>
        {theme === "dark"}
      </span>
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
