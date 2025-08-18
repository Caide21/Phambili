// ================================
// FILE: components/Clusters/PortalCluster.jsx
// Purpose: Drop-in, SSR-safe cluster system that renders a draggable + scalable
//          portal cluster with a central Reactor handle. Designed to live
//          directly on the page background (no extra canvases required).
//
// Features
// - Arrange N portals around a center using polar coords (radius, angleDeg)
// - Drag the whole cluster by clicking/dragging the Reactor (optional)
// - Scale controls (wheel on desktop, +/- buttons)
// - Optional per-page absolute placement with top/left in viewport px
// - Pure CSS transforms => zoom-safe and animation-friendly
// - No window access during SSR; pointer/DOM logic starts after mount
//
// Notes
// - You can spawn multiple clusters per page; each keeps local state
// - To keep background blending, the top container supports mix-blend modes
// - Keep comments intact; modify only when functionality changes
// ================================

import React, { useEffect, useMemo, useRef, useState } from "react";

// Portal visual: use the ringified, themeable SVG (preferred)
// If you prefer your card wrapper, swap the import to: "../Cards/PhambiliPortal"
import ThemeablePortal from "../Cards/PhambiliPortal";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

export default function PortalCluster({
  id = "cluster-1",
  // Page placement in viewport pixels/percent; you can also place via flex/grid wrappers
  top = 0,
  left = 0,
  initial = { x: 0, y: 0, scale: 1 },
  portals = [
    // Example pentagon around the center; override from page
    { id: "p1", label: "Portal 1", href: "#", angleDeg: -90, radius: 140, size: 120 },
    { id: "p2", label: "Portal 2", href: "#", angleDeg: -18, radius: 140, size: 120 },
    { id: "p3", label: "Portal 3", href: "#", angleDeg: 54, radius: 140, size: 120 },
    { id: "p4", label: "Portal 4", href: "#", angleDeg: 126, radius: 140, size: 120 },
    { id: "p5", label: "Portal 5", href: "#", angleDeg: 198, radius: 140, size: 120 },
  ],
  reactor = { size: 72, label: "Reactor" },
  draggable = true,
  scalable = true,
  showReactor = true,      // NEW: toggle reactor visibility
  blendMode = "screen",    // try: "screen", "lighten", or "normal"
  onChange,
  className = "",
}) {
  // SSR-safe mount gate
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const rootRef = useRef(null);
  const draggingRef = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  const [pos, setPos] = useState({ x: initial.x || 0, y: initial.y || 0 });
  const [scale, setScale] = useState(initial.scale || 1);

  // Handle dragging via the Reactor only (prevents selecting/dragging portals)
  const onPointerDownReactor = (e) => {
    if (!draggable || !mounted) return;
    const el = rootRef.current;
    if (!el) return;
    el.setPointerCapture?.(e.pointerId);
    draggingRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseX: pos.x,
      baseY: pos.y,
    };
  };

  const onPointerMove = (e) => {
    const d = draggingRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const next = { x: d.baseX + dx, y: d.baseY + dy };
    setPos(next);
    onChange?.({ id, ...next, scale });
  };

  const onPointerUp = (e) => {
    const el = rootRef.current;
    draggingRef.current.active = false;
    if (el) el.releasePointerCapture?.(e.pointerId);
  };

  // Mouse wheel scaling (desktop). Pinch will be ignored; custom handlers can be added later.
  const onWheel = (e) => {
    if (!scalable) return;
    if (e.ctrlKey) return; // avoid browser zoom conflicts
    const direction = e.deltaY > 0 ? -1 : 1;
    const next = clamp(Number((scale + direction * 0.08).toFixed(3)), 0.5, 2.0);
    setScale(next);
    onChange?.({ id, x: pos.x, y: pos.y, scale: next });
  };

  const incrementScale = (step) => () => {
    const next = clamp(Number((scale + step).toFixed(3)), 0.5, 2.0);
    setScale(next);
    onChange?.({ id, x: pos.x, y: pos.y, scale: next });
  };

  // Precompute portal placements in CSS pixels; we keep math inside the cluster
  const nodes = useMemo(() => {
    return portals.map((p) => {
      const rad = (p.angleDeg * Math.PI) / 180;
      const x = Math.cos(rad) * p.radius * scale;
      const y = Math.sin(rad) * p.radius * scale;
      const size = (p.size || 120) * scale;
      return { ...p, x, y, size };
    });
  }, [portals, scale]);

  // ---------- Render ----------
  // Container is absolutely positioned on the page at (top,left), then we move it by (pos.x, pos.y)
  return (
    <div
      id={id}
      ref={rootRef}
      className={`pointer-events-auto select-none absolute ${className}`}
      style={{ top, left, transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      {/* Inner stage keeps the blend aesthetics consistent with your background */}
      <div
        className="relative"
        style={{
          mixBlendMode: blendMode,
          filter: "drop-shadow(0 0 12px rgba(0,255,140,0.25))",
        }}
      >
        {/* Portals */}
        {nodes.map((p) => (
          <a
            key={p.id}
            href={p.href || "#"}
            className="absolute block"
            style={{
              left: `calc(50% + ${p.x}px - ${p.size / 2}px)`,
              top: `calc(50% + ${p.y}px - ${p.size / 2}px)`,
              width: p.size,
              height: p.size,
            }}
            aria-label={p.label || p.id}
          >
            <ThemeablePortal size={p.size} />
          </a>
        ))}

        {/* Reactor (drag handle) */}
        {showReactor && (
          <button
            type="button"
            onPointerDown={onPointerDownReactor}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/50 bg-emerald-400/10 backdrop-blur-sm px-4 py-2 text-emerald-200 hover:bg-emerald-400/20 active:scale-95"
            style={{ width: reactor.size, height: reactor.size }}
            aria-label={reactor.label || "Reactor"}
          >
            <span className="text-xs font-medium tracking-wide">
              {reactor.label || "Reactor"}
            </span>
          </button>
        )}
      </div>

      {/* Scale Controls (desktop friendly). Hide entirely if scalable is false */}
      {scalable && (
        <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <button
            type="button"
            onClick={incrementScale(+0.08)}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
          >
            +
          </button>
          <div className="text-center text-xs text-white/70">
            {(scale * 100).toFixed(0)}%
          </div>
          <button
            type="button"
            onClick={incrementScale(-0.08)}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
          >
            −
          </button>
        </div>
      )}
    </div>
  );
}
