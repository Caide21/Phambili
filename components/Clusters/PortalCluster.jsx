// components/Clusters/PortalCluster.jsx
// Radial layout engine for Phambili portals.
// Positions N children around a center (reactor) with responsive spacing.
// Preserves SSR/CSR parity: pure math, no layout effect needed.

import React from "react";

/**
 * PortalCluster
 *
 * Props:
 * - count: number of orbiting items (defaults to children.length if provided)
 * - children: render function or React nodes. If a function, it is called with {index, angleDeg}
 * - offsetDeg: rotation offset for the ring (default -90 so the first sits at the top)
 * - ringRadiusPct: fraction of the shortest side used for the ring radius (0.0–0.5). Default 0.36
 * - itemPct: size of each portal relative to the shortest side (0.0–1.0). Default 0.18
 * - minItemPx / maxItemPx: clamp portal size for extremes
 * - paddingPx: extra breathing room between portal edge and viewport edge
 * - showCenter: if true, render a center layer (useful for the reactor)
 * - center: optional React node for the center (reactor). If omitted and showCenter=true, nothing is rendered.
 * - className / style: forwarded to the container
 *
 * Usage:
 * <PortalCluster
 *    count={5}
 *    center={<ReactorPlaceholder />}
 * >
 *   {(p) => <PhambiliPortal key={p.index} />}
 * </PortalCluster>
 */
export default function PortalCluster({
  count,
  children,
  offsetDeg = -90,
  ringRadiusPct = 0.36,
  itemPct = 0.18,
  minItemPx = 140,
  maxItemPx = 260,
  paddingPx = 24,
  showCenter = true,
  center = null,
  className = "",
  style = {},
}) {
  // We size relative to viewport so the formation always fits without zooming.
  // Container is full-bleed and uses the shortest side to keep things square.
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 720;
  const shortest = Math.min(vw, vh);

  // Portal size scales with screen but is clamped for sanity.
  const itemSize = clamp(shortest * itemPct, minItemPx, maxItemPx);

  // The radius must account for portal radius and padding so edges never clip.
  // Effective max ring radius inside the viewport:
  const maxRingInside = (shortest / 2) - (itemSize / 2) - paddingPx;

  // Requested ring radius from pct:
  const requested = shortest * ringRadiusPct;

  const R = clamp(requested, itemSize * 0.9, maxRingInside);

  // If no count provided, try from children length (when children is an array).
  const n = typeof count === "number"
    ? count
    : React.Children.count(children);

  const items = Array.from({ length: n }, (_, i) => {
    const step = 360 / n;
    const angleDeg = offsetDeg + i * step;
    const rad = (angleDeg * Math.PI) / 180;
    // Origin is center of container; we place items with translate(-50%,-50%)
    const x = 50 + (Math.cos(rad) * R * 100) / shortest; // as %
    const y = 50 + (Math.sin(rad) * R * 100) / shortest; // as %
    return { i, angleDeg, x, y };
  });

  // Render children: support render-prop or node list
  const renderChild = (p) => {
    if (typeof children === "function") return children({ index: p.i, angleDeg: p.angleDeg });
    const arr = React.Children.toArray(children);
    return arr[p.i % arr.length] ?? null;
  };

  return (
    <div
      className={`relative w-full h-[calc(100vh-72px)] max-h-[100vh] overflow-hidden ${className}`}
      // NOTE: the 72px assumes a slim top nav; adjust if your nav height differs.
      style={style}
      aria-label="Portal Cluster"
    >
      {/* Center (reactor) */}
      {showCenter && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          {center}
        </div>
      )}

      {/* Orbiting portals */}
      {items.map((p) => (
        <div
          key={p.i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${(itemSize / shortest) * 100}%`,
            // Keep each portal square; height matches width through aspect-ratio.
            aspectRatio: "1 / 1",
            transform: "translate(-50%, -50%)",
          }}
        >
          {renderChild(p)}
        </div>
      ))}
    </div>
  );
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
