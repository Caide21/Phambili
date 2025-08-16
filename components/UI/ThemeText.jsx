import { useTheme } from "@/context/ThemeContext";

export default function ThemeText({ children, type = "body", color = "primary", className = "" }) {
  const theme = useTheme();
  const styles = {
    heading: `font-bold text-2xl md:text-3xl`,
    subheading: `font-semibold text-xl`,
    body: `text-base`,
  };

  return (
    <p
      className={`${styles[type]} ${className}`}
      style={{
        color: theme.colors[color],
        fontFamily: theme.font[type === "body" ? "body" : "heading"],
      }}
    >
      {children}
    </p>
  );
}
