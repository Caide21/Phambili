// tailwind.config.js
//Tailwind configuration for Phambili.
//Scans all components/pages/data/styles for class usage.
//Extends theme with custom keyframes + animations (slow-spin, portalPulse, breathe, ripple).
//Dark mode is toggled via `class` (see ThemeProvider).
//Think: “global design tokens + animations for the whole system.”

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
    "./data/**/*.{js,jsx,json}",
    "./hooks/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
    "./lib/agents/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./pages/api/**/*.{js,jsx}",
    "./public/data/**/*.{js,json}",
    "./styles/**/*.{js,jsx,css}",
    "./utils/**/*.{js,jsx}",
    "./utils/plugins/**/*.{js,jsx}",
    "./utils/plugins/ers/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slowSpin: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        portalPulse: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(30,185,125,0.25)" },
          "50%":     { boxShadow: "0 0 40px 6px rgba(30,185,125,0.35)" },
        },
        breathe: {
          "0%,100%": { transform: "scale(1)" },
          "50%":     { transform: "scale(1.02)" },
        },
        ripple: {
          "0%":   { transform: "scale(0.8)", opacity: 0.35 },
          "100%": { transform: "scale(1.5)", opacity: 0 },
        },
      },
      animation: {
        "slow-spin": "slowSpin 18s linear infinite",
        "portal-pulse": "portalPulse 3.5s ease-in-out infinite",
        "breathe": "breathe 2.4s ease-in-out infinite",
        "ripple": "ripple 700ms ease-out forwards",
      },
    },
  },
  darkMode: "class",
  plugins: [],
  future: { hoverOnlyWhenSupported: true },
};
