// components/Transitions/PortalTransitionProvider.jsx
//PortalTransitionProvider = controls a full-screen warp overlay when "entering" the portal.
//Exposes start(href) via context; plays animation, then router.push(href).
//Think: “cinematic door” between pages.

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/router";

const PortalCtx = createContext(null);

export function PortalTransitionProvider({ children }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [theme, setTheme] = useState("dark"); // match current if you like

  const start = useCallback((href, opts = {}) => {
    // optional: read current theme class from <html> to colorize overlay
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    setActive(true);
    const duration = opts.duration ?? 900; // must match CSS keyframe duration
    window.setTimeout(() => {
      router.push(href);
    }, duration - 50); // push just before it ends for snappier feel
  }, [router]);

  const value = useMemo(() => ({ start, active }), [start, active]);

  return (
    <PortalCtx.Provider value={value}>
      {children}

      {/* Full-screen overlay (only visible when active) */}
      {active && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {/* Background gradient that 'iris opens' */}
          <div className={[
            "absolute inset-0",
            "bg-gradient-to-b",
            theme === "dark"
              ? "from-zinc-900 via-black to-black"
              : "from-emerald-50 via-sky-50 to-zinc-100",
            "animate-iris-open",
          ].join(" ")} />

          {/* Streaks layer for travel feel */}
          <div
            className="absolute inset-0 opacity-50 mix-blend-screen"
            style={{
              backgroundImage:
                "repeating-radial-gradient( circle at 50% 50%, rgba(255,255,255,0.12) 0 2px, transparent 2px 6px )",
              backgroundSize: "120px 120px",
            }}
          />

          {/* Central portal swell (scaled up quickly) */}
          <div className="absolute inset-0 grid place-items-center">
            <div className={[
              "h-48 w-48 rounded-full",
              theme === "dark"
                ? "bg-emerald-300/20 ring-2 ring-emerald-400/50"
                : "bg-emerald-600/10 ring-2 ring-emerald-600/50",
              "shadow-[0_0_80px_20px_rgba(30,185,125,0.25)]",
              "animate-warp-zoom",
            ].join(" ")} />
          </div>

          {/* Optional: subtle vignette */}
          <div className="absolute inset-0 pointer-events-none"
               style={{ boxShadow: "inset 0 0 180px 60px rgba(0,0,0,0.35)" }} />
        </div>
      )}
    </PortalCtx.Provider>
  );
}

export function usePortalTransition() {
  const ctx = useContext(PortalCtx);
  if (!ctx) throw new Error("usePortalTransition must be used within <PortalTransitionProvider>");
  return ctx;
}
