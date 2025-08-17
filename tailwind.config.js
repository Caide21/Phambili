// tailwind.config.js
//Tailwind configuration for Phambili.
//Scans all components/pages/data/styles for class usage.
//Extends theme with custom keyframes + animations (slow-spin, portalPulse, breathe, ripple, warpZoom, irisOpen, starStreaks).
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
        warpZoom: {
          "0%":   { transform: "scale(1)",   filter: "blur(0px)",   opacity: "1" },
          "60%":  { transform: "scale(8)",   filter: "blur(2px)",   opacity: "1" },
          "100%": { transform: "scale(20)",  filter: "blur(4px)",   opacity: "1" },
        },
        irisOpen: {
          "0%":   { clipPath: "circle(0% at 50% 50%)" },
          "100%": { clipPath: "circle(150% at 50% 50%)" },
        },
        starStreaks: {
          "0%":   { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 200%" },
        },
      },
      animation: {
        "slow-spin": "slowSpin 18s linear infinite",
        "portal-pulse": "portalPulse 3.5s ease-in-out infinite",
        "breathe": "breathe 2.4s ease-in-out infinite",
        "ripple": "ripple 700ms ease-out forwards",
        "warp-zoom": "warpZoom 900ms cubic-bezier(.2,.65,.2,1) forwards",
        "iris-open": "irisOpen 900ms ease-out forwards",
        "star-streaks": "starStreaks 900ms linear forwards",
      },
    },
  },
  darkMode: "class",
  plugins: [],
  future: { hoverOnlyWhenSupported: true },
};
