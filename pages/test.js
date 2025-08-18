// pages/test.js
import React, { useState } from "react";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";
import FullBleedStage from "@/components/Layout/FullBleedStage";
import PortalCluster from "@/components/Clusters/PortalCluster";

// Transition system (adjust paths if yours differ)
import { PortalTransitionProvider } from "@/components/Transitions/PortalTransitionProvider";
import PortalLink from "@/components/Transitions/PortalLink";

export default function TestPage() {
  const [count, setCount] = useState(5);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [moveMode, setMoveMode] = useState(true);

  // Minimal items; cluster auto-forms triangle/pentagon/hex…
  const portals = Array.from({ length: count }, (_, i) => ({
    id: `p-${i + 1}`,
    label: `Portal ${i + 1}`,
    href: "/", // always go to index.js
  }));

  return (
    <ThemeProvider>
      <PortalTransitionProvider>
        <FullBleedStage className="bg-gradient-to-bl from-[#041F1A] via-[#062821] to-[#04140F] overflow-hidden">
          {/* subtle glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 55% at 55% 45%, rgba(16,175,110,0.18) 0%, rgba(0,0,0,0) 60%)",
            }}
          />

          {/* Cluster (controlled) */}
          <PortalCluster
            id="cluster-test"
            top="50%"
            left="50%"
            portals={portals}
            // controlled by GUI
            scale={scale}
            onScaleChange={setScale}
            position={pos}
            onPositionChange={setPos}
            // behavior
            draggable={moveMode}
            scalable={false}        // size via slider; wheel off
            // links + transition
            wrapWithAnchor
            LinkComponent={PortalLink}
            blendMode="screen"
            showBuiltInScale={false}
            showReactor={false}
          />

          {/* HUD */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50" data-cluster-hud>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
              {/* Count */}
              <button
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                className="rounded-lg border border-white/30 px-2 py-1 text-white hover:bg-white/10"
                title="Remove portal"
              >
                −
              </button>
              <div className="text-white/90 text-sm w-20 text-center">
                {count} {count === 1 ? "portal" : "portals"}
              </div>
              <button
                onClick={() => setCount((c) => Math.min(20, c + 1))}
                className="rounded-lg border border-white/30 px-2 py-1 text-white hover:bg-white/10"
                title="Add portal"
              >
                +
              </button>

              {/* Size */}
              <span className="text-white/70 text-xs w-10 text-right">Size</span>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.01}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-40 accent-emerald-400"
              />
              <span className="text-white/80 text-xs tabular-nums w-10 text-right">
                {(scale * 100).toFixed(0)}%
              </span>

              {/* Move mode */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={moveMode}
                  onChange={(e) => setMoveMode(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-white/80 text-sm">Move mode</span>
              </label>

              {/* Reset pos */}
              <button
                onClick={() => setPos({ x: 0, y: 0 })}
                className="ml-2 rounded-lg border border-white/30 px-2 py-1 text-white hover:bg-white/10"
                title="Re-center"
              >
                Reset pos
              </button>
            </div>
          </div>
        </FullBleedStage>
      </PortalTransitionProvider>
    </ThemeProvider>
  );
}
