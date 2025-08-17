// pages/index.js
// Reactor = drag handle; cluster is draggable & scalable.
// Requires: npm i framer-motion

import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import ReactorPlaceholder from "@/components/Scene/ReactorPlaceholder";
import PhambiliPortal from "@/components/Cards/PhambiliPortal";
import PortalLink from "@/components/Transitions/PortalLink";

const PORTALS = [
  { key: "msw",     angle:  90 },
  { key: "clean",   angle:  18 },
  { key: "agri",    angle: 162 },
  { key: "plastic", angle: 234 },
  { key: "biosol",  angle: 306 },
];

const DEST = {
  msw: "/technology",
  clean: "/impact",
  agri: "/applications",
  plastic: "/applications",
  biosol: "/contact",
};

// Place a child at polar angle around cluster center
function PortalAtAngle({ angleDeg, children }) {
  const r = "var(--orbit-radius)";
  const rot = `rotate(${angleDeg}deg)`;
  const back = `rotate(${-angleDeg}deg)`;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) ${rot} translate(${r}) ${back}`,
        pointerEvents: "none",
      }}
    >
      <div style={{ width: "var(--portal-size)", aspectRatio: "1/1", pointerEvents: "auto" }}>
        {children}
      </div>
    </div>
  );
}

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

export default function Home() {
  const boundsRef = useRef(null);

  // Drag controlled via reactor
  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // UI state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // ---- Hydration-safe mounting + persisted state ----
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1); // SSR-safe default (don't read localStorage here)

  useEffect(() => {
    setMounted(true);
    try {
      const s = parseFloat(localStorage.getItem("clusterScale") || "1");
      if (Number.isFinite(s)) setScale(clamp(s, 0.6, 1.6));

      const off = localStorage.getItem("clusterOffset");
      if (off) {
        const { x: ox = 0, y: oy = 0 } = JSON.parse(off);
        x.set(ox);
        y.set(oy);
        setPos({ x: ox, y: oy });
      }
    } catch {
      /* ignore */
    }
  }, [x, y]);

  // Persist scale changes
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("clusterScale", String(scale));
    } catch {/* ignore */}
  }, [mounted, scale]);

  const nudgeScale = (delta) =>
    setScale((s) => clamp(Number((s + delta).toFixed(2)), 0.6, 1.6));

  return (
    <>
      <Head>
        <title>Phambili — Waste to Value</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Full-stage bounds for drag; also capture modified wheel for zoom */}
      <div
        ref={boundsRef}
        className="absolute inset-0"
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey || e.shiftKey) {
            e.preventDefault();
            nudgeScale(e.deltaY > 0 ? -0.05 : 0.05);
          }
        }}
      >
        {/* HUD renders only after mount to avoid hydration text mismatch */}
        {mounted && (
          <div className="fixed z-40 bottom-4 left-4 flex items-center gap-3 p-2 rounded-lg bg-black/35 border border-white/10 text-white/90 backdrop-blur">
            <pre className="text-xs m-0" suppressHydrationWarning>
{`pos { x:${Math.round(pos.x)} y:${Math.round(pos.y)} }  scale ${scale.toFixed(2)}x`}
            </pre>
            <button
              className="px-2 py-1 text-sm rounded border border-white/20 hover:bg-white/10"
              onClick={() => nudgeScale(-0.05)}
              title="Scale down (-)"
            >
              −
            </button>
            <input
              type="range"
              min="0.6"
              max="1.6"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
            <button
              className="px-2 py-1 text-sm rounded border border-white/20 hover:bg-white/10"
              onClick={() => nudgeScale(+0.05)}
              title="Scale up (+)"
            >
              +
            </button>
            <button
              className="px-2 py-1 text-sm rounded border border-white/20 hover:bg-white/10"
              onClick={() => setScale(1)}
              title="Reset scale to 1"
            >
              1×
            </button>
          </div>
        )}

        {/* Center the draggable + scalable cluster */}
        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            className="relative"
            style={{
              width: "min(92vmin, 92svmin)",
              height: "min(92vmin, 92svmin)",
              x,
              y,
              scale, // uniform cluster scale
              transformOrigin: "50% 50%",
              cursor: dragging ? "grabbing" : "default",
            }}
            drag
            dragListener={false} // only the reactor can start drag
            dragControls={controls}
            dragConstraints={boundsRef}
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={() => setDragging(true)}
            onDragEnd={() => {
              setDragging(false);
              // persist final offset (avoid spamming storage every frame)
              try {
                localStorage.setItem(
                  "clusterOffset",
                  JSON.stringify({ x: x.get(), y: y.get() })
                );
              } catch {/* ignore */}
            }}
            onUpdate={(latest) => {
              const nx = Number(latest.x ?? x.get());
              const ny = Number(latest.y ?? y.get());
              setPos({ x: nx, y: ny }); // live display only
            }}
          >
            {/* REACTOR = DRAG HANDLE */}
            <button
              aria-label="Drag cluster"
              title="Drag cluster (Alt+Double-click to reset scale)"
              onPointerDown={(e) => controls.start(e)}
              onDoubleClick={(e) => {
                // Double-click recenters; hold Alt to also reset scale
                x.set(0);
                y.set(0);
                setPos({ x: 0, y: 0 });
                if (e.altKey) setScale(1);
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
              style={{
                cursor: dragging ? "grabbing" : "grab",
                pointerEvents: "auto",
                zIndex: 2,
                background: "transparent",
                border: 0,
                padding: 0,
              }}
            >
              <ReactorPlaceholder />
            </button>

            {/* Orbiting portals (clickable) */}
            {PORTALS.map((p, i) => (
              <PortalAtAngle key={p.key} angleDeg={p.angle}>
                <PortalLink href={DEST[p.key] ?? "/technology"}>
                  <div className="transition-transform duration-200 hover:scale-[1.02] active:scale-95">
                    <PhambiliPortal
                      showPlate={false}
                      label=""
                      direction={i % 2 === 0 ? "cw" : "ccw"}
                    />
                  </div>
                </PortalLink>
              </PortalAtAngle>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
