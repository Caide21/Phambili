// components/Clusters/PortalCluster.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import PhambiliPortal from "@/components/Cards/PhambiliPortal"; // visual-only (no <a>)

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const DRAG_THRESHOLD_PX = 5;

const makeRing = ({ count, radius, size, startAngle = -90, hrefPrefix = "/#", labelPrefix = "Portal" }) => {
  const step = 360 / count;
  return Array.from({ length: count }).map((_, i) => ({
    id: `${labelPrefix.toLowerCase()}-${i + 1}`,
    label: `${labelPrefix} ${i + 1}`,
    href: `${hrefPrefix}/${i + 1}`,
    angleDeg: startAngle + i * step,
    radius,
    size,
  }));
};
const makePolygon = (args) => makeRing(args);

export default function PortalCluster({
  id = "cluster-1",
  top = "50%",
  left = "50%",
  initial = { x: 0, y: 0, scale: 1 },
  count,
  ringConfig,
  portals,
  defaultRadius = 160,
  defaultSize = 140,
  autoLayout = true,
  layoutStartAngle = -90,
  draggable = true,
  scalable = true,
  blendMode = "screen",
  wrapWithAnchor = true,
  LinkComponent, // e.g. PortalLink
  scale,
  onScaleChange,
  position,
  onPositionChange,
  showBuiltInScale = false,
  showReactor = false,
  reactor = { size: 72, label: "Reactor" },
  onChange,
  className = "",
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const rootRef = useRef(null);
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  const [posState, setPosState] = useState({ x: initial.x || 0, y: initial.y || 0 });
  const [scaleState, setScaleState] = useState(initial.scale || 1);

  const pos = position ?? posState;
  const scaleVal = typeof scale === "number" ? scale : scaleState;

  const setPos = (next) => (position && onPositionChange ? onPositionChange(next) : setPosState(next));
  const setScaleVal = (next) => (typeof scale === "number" && onScaleChange ? onScaleChange(next) : setScaleState(next));

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const nested = rootRef.current?.querySelector("a a");
      if (nested) console.error("[PortalCluster] Nested <a> detected. Ensure PhambiliPortal has NO <a> inside.");
    }
  }, []);

  const beginDrag = (e) => {
    if (!draggable || !mounted) return;
    rootRef.current?.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      baseX: pos.x,
      baseY: pos.y,
    };
  };
  const onPointerDownRoot = (e) => {
    if (e.target.closest("[data-cluster-hud]")) return;
    beginDrag(e);
  };
  const onPointerDownPortal = (e) => beginDrag(e);
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && (Math.abs(dx) > DRAG_THRESHOLD_PX || Math.abs(dy) > DRAG_THRESHOLD_PX)) d.moved = true;
    const next = { x: d.baseX + dx, y: d.baseY + dy };
    setPos(next);
    onChange?.({ id, ...next, scale: scaleVal });
  };
  const endDrag = (e) => {
    dragRef.current.active = false;
    rootRef.current?.releasePointerCapture?.(e.pointerId);
    setTimeout(() => (dragRef.current.moved = false), 0);
  };

  const onWheel = (e) => {
    if (!scalable || e.ctrlKey) return;
    const dir = e.deltaY > 0 ? -1 : 1;
    const next = clamp(Number((scaleVal + dir * 0.08).toFixed(3)), 0.5, 2.0);
    setScaleVal(next);
    onChange?.({ id, x: pos.x, y: pos.y, scale: next });
  };
  const bumpScale = (step) => () => {
    const next = clamp(Number((scaleVal + step).toFixed(3)), 0.5, 2.0);
    setScaleVal(next);
    onChange?.({ id, x: pos.x, y: pos.y, scale: next });
  };

  const nodes = useMemo(() => {
    let base = [];
    if (Array.isArray(portals) && portals.length) {
      const n = portals.length;
      const step = 360 / Math.max(n, 1);
      base = portals.map((p, i) => {
        const angleDeg = autoLayout && p.angleDeg == null ? layoutStartAngle + i * step : p.angleDeg ?? layoutStartAngle;
        const radius = autoLayout && p.radius == null ? defaultRadius : p.radius ?? defaultRadius;
        const size = p.size ?? defaultSize;
        return { ...p, angleDeg, radius, size };
      });
    } else if (Array.isArray(ringConfig) && ringConfig.length) {
      base = ringConfig.flatMap((r, idx) => makeRing({ ...r, labelPrefix: `Ring${idx + 1}` }));
    } else if (typeof count === "number" && count > 0) {
      base = makePolygon({ count, radius: defaultRadius, size: defaultSize, startAngle: layoutStartAngle, labelPrefix: "Portal" });
    } else {
      base = makePolygon({ count: 5, radius: defaultRadius, size: defaultSize, startAngle: layoutStartAngle, labelPrefix: "Portal" });
    }

    return base.map((p) => {
      const rad = ((p.angleDeg ?? layoutStartAngle) * Math.PI) / 180;
      const r = (p.radius ?? defaultRadius) * scaleVal;
      const x = Math.cos(rad) * r;
      const y = Math.sin(rad) * r;
      const size = (p.size ?? defaultSize) * scaleVal;
      return { ...p, x, y, size };
    });
  }, [portals, ringConfig, count, defaultRadius, defaultSize, autoLayout, layoutStartAngle, scaleVal]);

  const onPortalClickCapture = (e) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      id={id}
      ref={rootRef}
      className={`pointer-events-auto select-none absolute ${className}`}
      style={{ top, left, transform: `translate(-50%, -50%) translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      onPointerDown={onPointerDownRoot}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
    >
      <div
        className="relative"
        style={{ mixBlendMode: blendMode, filter: "drop-shadow(0 0 12px rgba(0,255,140,0.25))" }}
      >
        {nodes.map((p) => {
          const wrapperStyle = {
            left: `calc(50% + ${p.x}px - ${p.size / 2}px)`,
            top: `calc(50% + ${p.y}px - ${p.size / 2}px)`,
            width: p.size,
            height: p.size,
          };

          return (
            <div
              key={p.id}
              className="absolute block"
              style={wrapperStyle}
              onPointerDown={onPointerDownPortal}
              onClickCapture={onPortalClickCapture}
              role="group"
            >
              {wrapWithAnchor ? (
                (() => {
                  const Link = LinkComponent || "a";
                  return (
                    <Link href={p.href || "#"} aria-label={p.label || p.id} className="block">
                      <PhambiliPortal label={p.label} size={p.size} />
                    </Link>
                  );
                })()
              ) : (
                <PhambiliPortal label={p.label} size={p.size} />
              )}
            </div>
          );
        })}

        {showReactor && (
          <button
            type="button"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/50 bg-emerald-400/10 backdrop-blur-sm px-4 py-2 text-emerald-200"
            style={{ width: reactor.size, height: reactor.size }}
            aria-label={reactor.label || "Reactor"}
          >
            <span className="text-xs font-medium tracking-wide">{reactor.label || "Reactor"}</span>
          </button>
        )}
      </div>

      {showBuiltInScale && scalable && (
        <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2" data-cluster-hud>
          <button
            type="button"
            onClick={bumpScale(+0.08)}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
          >
            +
          </button>
          <div className="text-center text-xs text-white/70">{(scaleVal * 100).toFixed(0)}%</div>
          <button
            type="button"
            onClick={bumpScale(-0.08)}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
          >
            −
          </button>
        </div>
      )}
    </div>
  );
}
