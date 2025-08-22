// Global portal transition overlay with robust teardown.
// - start(href?, opts?) shows the overlay + optionally navigates.
// - Overlay ALWAYS ends on routeComplete/routeError and via a watchdog.
// - Visuals: iris-open bg + radial streaks + central warp swell.

import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

export const PortalTransitionContext = createContext({
  active: false,
  start: (_href, _opts) => {},
  end: () => {},
});

export function PortalTransitionProvider({ children }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [theme, setTheme] = useState("dark"); // used to tint the overlay
  const watchdogRef = useRef(null);

  const end = useCallback(() => {
    setActive(false);
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  const start = useCallback(
    (href, opts = {}) => {
      const isDark =
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");

      setActive(true);

      const pushDelay = Number.isFinite(opts.pushDelay) ? opts.pushDelay : 200;
      const maxDuration = Number.isFinite(opts.maxDuration) ? opts.maxDuration : 3000;

      if (watchdogRef.current) clearTimeout(watchdogRef.current);
      watchdogRef.current = setTimeout(() => end(), maxDuration);

      if (href) {
        setTimeout(() => {
          router.push(href).catch(() => end());
        }, Math.max(0, pushDelay));
      }
    },
    [router, end]
  );

  useEffect(() => {
    const done = () => end();
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);
    return () => {
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
    };
  }, [router.events, end]);

  const value = useMemo(() => ({ active, start, end }), [active, start, end]);

  return (
    <PortalTransitionContext.Provider value={value}>
      {children}

      {/* Overlay is always mounted; inert when inactive */}
      <div
        data-portal-overlay
        aria-hidden
        className={[
          "fixed inset-0 transition-opacity duration-200",
          active ? "opacity-100 pointer-events-auto z-[9999]" : "opacity-0 pointer-events-none -z-10",
        ].join(" ")}
        style={{ visibility: active ? "visible" : "hidden" }}
      >
        {/* Background iris */}
        <div
          className={[
            "absolute inset-0 bg-gradient-to-b",
            theme === "dark"
              ? "from-zinc-900 via-black to-black"
              : "from-emerald-50 via-sky-50 to-zinc-100",
            active ? "animate-iris-open" : "",
          ].join(" ")}
        />

        {/* Radial streaks / starfield feel */}
        <div
          className="absolute inset-0 opacity-50 mix-blend-screen"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0 2px, transparent 2px 6px)",
            backgroundSize: "120px 120px",
          }}
        />

        {/* Central swell */}
        <div className="absolute inset-0 grid place-items-center">
          <div
            className={[
              "h-48 w-48 rounded-full",
              theme === "dark"
                ? "bg-emerald-300/20 ring-2 ring-emerald-400/50"
                : "bg-emerald-600/10 ring-2 ring-emerald-600/50",
              "shadow-[0_0_80px_20px_rgba(30,185,125,0.25)]",
              active ? "animate-warp-zoom" : "",
            ].join(" ")}
          />
        </div>

        {/* Soft vignette to sell depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 180px 60px rgba(0,0,0,0.35)" }}
        />

        {/* Inject the keyframes so visuals work even if Tailwind isn't configured */}
        <style jsx global>{`
          @keyframes iris-open-kf {
            0% { transform: scale(0.96); opacity: 0.0; }
            30% { opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes warp-zoom-kf {
            0% { transform: scale(0.85); box-shadow: 0 0 40px 10px rgba(30,185,125,0.18); }
            50% { transform: scale(1.06); box-shadow: 0 0 120px 30px rgba(30,185,125,0.28); }
            100% { transform: scale(1.0); box-shadow: 0 0 80px 20px rgba(30,185,125,0.25); }
          }
          .animate-iris-open {
            animation: iris-open-kf 420ms ease forwards;
          }
          .animate-warp-zoom {
            animation: warp-zoom-kf 520ms cubic-bezier(.2,.65,.2,1) forwards;
          }
        `}</style>
      </div>
    </PortalTransitionContext.Provider>
  );
}
