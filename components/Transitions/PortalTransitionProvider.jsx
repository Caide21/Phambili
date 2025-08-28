// components/Transitions/PortalTransitionProvider.jsx
// Global portal transition overlay (hyperspace starfield + warp ring)
// - Robust plumbing unchanged: context API, router teardown, min-duration, watchdog
// - Visuals edited in-place (no new component files)
// - Reduced-motion fallback (static stars)

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";

export const PortalTransitionContext = createContext({
  active: false,
  start: (_href, _opts) => {},
  end: () => {},
});

const DEBUG_VISUALS = false; // set true to show a big overlay banner for QA

export function PortalTransitionProvider({ children }) {
  const router = useRouter();

  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const startTimeRef = useRef(null);
  const pushTimerRef = useRef(null);
  const watchdogRef = useRef(null);

  // Canvas/starfield refs
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const starsRef = useRef(null);
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });
  const reducedRef = useRef(false);
  const lastTsRef = useRef(0);

  // --- controls --------------------------------------------------------------
  const end = useCallback(() => {
    const now = Date.now();
    const minDuration = 1200; // keep visible long enough to notice

    // If we somehow lost the start timestamp (e.g., subtree remount),
    // pretend we just started now to still enforce the minimum duration.
    const startedAt = startTimeRef.current ?? now;
    const elapsed = now - startedAt;

    const finish = () => {
      setActive(false);
      startTimeRef.current = null;
    };

    if (elapsed < minDuration) {
      setTimeout(finish, minDuration - elapsed);
    } else {
      finish();
    }

    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  const start = useCallback(
    (href, opts = {}) => {
      const pushDelay =
        Number.isFinite(opts.pushDelay) ? opts.pushDelay : 400;
      const maxDuration =
        Number.isFinite(opts.maxDuration) ? opts.maxDuration : 5000;

      startTimeRef.current = Date.now();
      setActive(true);

      // Push after a short delay so visuals actually appear first
      if (href) {
        if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
        pushTimerRef.current = setTimeout(() => {
          router.push(href).catch(() => end());
        }, Math.max(0, pushDelay));
      }

      // Watchdog to guarantee teardown
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
      watchdogRef.current = setTimeout(
        () => end(),
        Math.max(1200, maxDuration)
      );
    },
    [router, end]
  );

  // --- lifecycle: router events & cleanup -----------------------------------
  useEffect(() => {
    setMounted(true);
    const done = () => end();
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);
    return () => {
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [router.events, end]);

  const value = useMemo(() => ({ active, start, end }), [active, start, end]);

  // --- starfield internals ---------------------------------------------------
  // Easing for initial punch
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    const rect = { w: canvas.clientWidth, h: canvas.clientHeight };
    canvas.width = Math.max(1, Math.floor(rect.w * dpr));
    canvas.height = Math.max(1, Math.floor(rect.h * dpr));
    dimsRef.current = { w: canvas.width, h: canvas.height, dpr };
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return ctx;
  }, []);

  const makeStars = useCallback(() => {
    const { w, h } = dimsRef.current;
    const isCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
    const budget = isCoarse ? 240 : 520; // scale for mobile/desktop
    const count =
      reducedRef.current ? Math.floor(budget * 0.4) : budget;

    const stars = new Array(count);
    for (let i = 0; i < count; i++) {
      // Start near center with small radius
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(w, h) * 0.02; // seed tight
      const speed = 0.24 + Math.random() * 0.9; // base radial speed
      stars[i] = { angle, radius, speed, x: 0, y: 0, px: 0, py: 0 };
    }
    starsRef.current = stars;
  }, []);

  const recycleStar = (s) => {
    const { w, h } = dimsRef.current;
    s.angle = Math.random() * Math.PI * 2;
    s.radius = Math.random() * Math.min(w, h) * 0.02;
    s.speed = 0.24 + Math.random() * 0.9;
    s.px = s.py = s.x = s.y = 0;
  };

  const paintStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = initCanvas();
    if (!ctx) return;
    const { w, h, dpr } = dimsRef.current;

    // Clear to near-black with faint emerald radial
    const grad = ctx.createRadialGradient(
      w * 0.5,
      h * 0.5,
      0,
      w * 0.5,
      h * 0.5,
      Math.max(w, h) * 0.6
    );
    grad.addColorStop(0, "rgba(16,185,129,0.08)");
    grad.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const stars = starsRef.current || [];
    ctx.save();
    ctx.translate(0.5, 0.5); // subpixel crispness
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const cx = w * 0.5;
      const cy = h * 0.5;
      const r = s.radius + Math.random() * 3 * dpr;
      const x = cx + Math.cos(s.angle) * r;
      const y = cy + Math.sin(s.angle) * r;
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();
  }, [initCanvas]);

  const animate = useCallback(
    (ts) => {
      const canvas = canvasRef.current;
      if (!canvas || !active) {
        rafRef.current = null;
        return;
      }
      const ctx = canvas.getContext("2d");
      const { w, h, dpr } = dimsRef.current;

      // dt
      const last = lastTsRef.current || ts;
      const dt = Math.max(0.001, (ts - last) / 1000);
      lastTsRef.current = ts;

      // initial punch factor ~ first 350ms then glide
      const startedAt = startTimeRef.current || Date.now();
      const elapsed = (Date.now() - startedAt) / 1000;
      const punch = Math.min(1, elapsed / 0.35);
      const warpFactor = 0.6 + easeOutCubic(punch) * 2.0; // 0.6 -> ~2.6

      // multiplicative fade to leave light trails
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillRect(0, 0, w, h);

      // faint emerald radial tint for brand
      const grad = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.6
      );
      grad.addColorStop(0, "rgba(16,185,129,0.08)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const stars = starsRef.current || [];
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // previous position
        const px = s.x || cx;
        const py = s.y || cy;

        // advance radius
        s.radius += s.speed * (warpFactor + 0.15) * (dt * 420); // scale constant

        // new position from polar
        const x = cx + Math.cos(s.angle) * s.radius;
        const y = cy + Math.sin(s.angle) * s.radius;

        // draw streak
        const dx = x - px;
        const dy = y - py;
        const len = Math.hypot(dx, dy);

        // thickness/alpha shrink as distance increases
        const rNorm = Math.min(
          1,
          Math.hypot(x - cx, y - cy) / (Math.max(w, h) * 0.5)
        );
        const lw = Math.max(0.5 * dpr, 2.2 * dpr - rNorm * 1.8 * dpr);
        const alpha = 0.25 + (1 - rNorm) * 0.65;

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.lineWidth = lw;

        // small segment yields a streak
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();

        // update star pos
        s.px = px;
        s.py = py;
        s.x = x;
        s.y = y;

        // recycle offscreen stars
        if (
          x < -16 || x > w + 16 ||
          y < -16 || y > h + 16
        ) {
          recycleStar(s);
        }
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(animate);
    },
    [active]
  );

  // Mount/resize and active toggles
  useEffect(() => {
    if (!mounted) return;
    reducedRef.current =
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const handleResize = () => {
      initCanvas();
      if (!starsRef.current) makeStars();
      if (reducedRef.current) paintStatic();
    };

    const ctx = initCanvas();
    if (!starsRef.current) makeStars();
    if (reducedRef.current) {
      paintStatic();
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted, initCanvas, makeStars, paintStatic]);

  // Start/stop animation with active
  useEffect(() => {
    if (!mounted) return;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (active && !reducedRef.current) {
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    } else if (reducedRef.current) {
      paintStatic();
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [active, mounted, animate, paintStatic]);

  // --- overlay (rendered into <body>) ---------------------------------------
  const overlay = (
    <div
      data-portal-overlay
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: active ? 100000 : -1,
        opacity: active ? 1 : 0,
        visibility: active ? "visible" : "hidden",
        transition: "opacity 300ms ease",
        pointerEvents: active ? "auto" : "none",
        isolation: "isolate",
        willChange: "opacity",
        backgroundColor: "black", // deep space
      }}
    >
      {/* STARFIELD CANVAS */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          mixBlendMode: "screen", // lets whites bloom over emerald tint
        }}
      />

      {/* CENTRAL WARP RING (kept from your design) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "56vmin",
          height: "56vmin",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "rgba(52, 211, 153, 0.20)",
          border: "2px solid rgba(52, 211, 153, 0.65)",
          boxShadow: "0 0 160px 60px rgba(30,185,125,0.40)",
          animation: active
            ? "warpZoom 560ms cubic-bezier(0.2, 0.65, 0.2, 1) forwards"
            : "none",
          willChange: "transform, box-shadow",
        }}
      />

      {/* SOFT VIGNETTE (kept) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 220px 90px rgba(0,0,0,0.42)",
          pointerEvents: "none",
        }}
      />
    </div>
  );

  return (
    <PortalTransitionContext.Provider value={value}>
      {children}

      {/* Optional debug banner (kept off by default) */}
      {DEBUG_VISUALS && active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100001,
            backgroundColor: "transparent",
            outline: "4px solid rgba(255,0,128,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
        >
          🌀 PORTAL TRANSITION ACTIVE
        </div>
      )}

      {/* render to <body> for bulletproof stacking */}
      {mounted ? createPortal(overlay, document.body) : null}

      {/* Global keyframes (warp ring kept) */}
      <style jsx global>{`
        @keyframes warpZoom {
          0%   { transform: translate(-50%, -50%) scale(0.82); box-shadow: 0 0 40px 10px rgba(30,185,125,0.22); }
          50%  { transform: translate(-50%, -50%) scale(1.08); box-shadow: 0 0 160px 50px rgba(30,185,125,0.48); }
          100% { transform: translate(-50%, -50%) scale(1.00); box-shadow: 0 0 120px 40px rgba(30,185,125,0.38); }
        }
      `}</style>
    </PortalTransitionContext.Provider>
  );
}
