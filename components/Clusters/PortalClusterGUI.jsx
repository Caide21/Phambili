// components/Clusters/PortalClusterGUI.jsx
import React, { useState } from "react";
import PortalCluster from "./PortalCluster";

export default function PortalClusterGUI({
  id = "cluster-gui",
  top = "50%",
  left = "50%",
  initial = { x: -260, y: -40, scale: 1 },
  startCount = 5,
}) {
  const [count, setCount] = useState(startCount);
  const [scale, setScale] = useState(initial.scale || 1);
  const [pos, setPos] = useState({ x: initial.x || 0, y: initial.y || 0 });
  const [moveMode, setMoveMode] = useState(true); // drag enabled

  const addPortal = () => setCount((c) => Math.min(c + 1, 20));
  const removePortal = () => setCount((c) => Math.max(c - 1, 1));

  return (
    <>
      {/* Cluster */}
      <PortalCluster
        id={id}
        top={top}
        left={left}
        count={count}
        wrapWithAnchor={false}       // your PhambiliPortal already has <a>
        draggable={moveMode}
        scalable={false}             // wheel scaling off; we control via GUI
        scale={scale}                // controlled
        onScaleChange={setScale}
        position={pos}               // controlled
        onPositionChange={setPos}
        showBuiltInScale={false}
        blendMode="screen"
      />

      {/* HUD */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
          {/* Count */}
          <div className="flex items-center gap-2">
            <button
              onClick={removePortal}
              className="rounded-lg border border-white/30 px-2 py-1 text-white hover:bg-white/10"
              title="Remove portal"
            >
              −
            </button>
            <div className="text-white/90 text-sm w-16 text-center">
              {count} {count === 1 ? "portal" : "portals"}
            </div>
            <button
              onClick={addPortal}
              className="rounded-lg border border-white/30 px-2 py-1 text-white hover:bg-white/10"
              title="Add portal"
            >
              +
            </button>
          </div>

          {/* Scale */}
          <div className="flex items-center gap-2">
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
          </div>

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

          {/* Reset */}
          <button
            onClick={() => { setPos({ x: initial.x || 0, y: initial.y || 0 }); }}
            className="ml-2 rounded-lg border border-white/30 px-2 py-1 text-white hover:bg-white/10"
            title="Re-center"
          >
            Reset pos
          </button>
        </div>
      </div>
    </>
  );
}
