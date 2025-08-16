import { createContext, useContext } from "react";

const theme = {
  colors: {
    primary: "#1B4332",   // deep green
    secondary: "#E8E4D9", // light earth tone
    accentGold: "#FFB703",
    accentBlue: "#0096C7",
    neutral: "#F9FAF9",
  },
  font: {
    heading: "Montserrat, sans-serif",
    body: "Lato, sans-serif",
  }
};

const ThemeContext = createContext(theme);
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);
