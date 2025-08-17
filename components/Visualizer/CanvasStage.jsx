// components/Visualizer/CanvasStage.jsx
// Client component, no SSR access to window at import time.
// Renders a <canvas> that drives the effect loop with requestAnimationFrame.
// WebGL path (default): Use a fragment shader with uniforms
// Fallback path: If WebGL unsupported or reduced-motion is on, render a CSS/Tailwind animated gradient

import React, { useRef, useEffect, useState, useCallback } from "react";

// Temporary simplified version for debugging
export default function CanvasStage({
  playing,
  intensity,
  kaleidoSegments,
  zoom,
  chromaShift,
  noise,
  hueShift,
  audioReactive,
  reducedMotion,
}) {
  return (
    <div className="relative w-full h-full">
      {/* Simple CSS fallback for now */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, 
              hsl(${hueShift}, 70%, 60%) 0%, 
              hsl(${hueShift + 60}, 70%, 40%) 50%, 
              hsl(${hueShift + 120}, 70%, 20%) 100%)
          `,
          transform: `scale(${zoom})`,
          transition: reducedMotion ? "transform 2s ease-in-out" : "transform 0.3s ease-out",
        }}
      >
        {/* Kaleidoscope effect using CSS */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              conic-gradient(
                from 0deg,
                hsl(${hueShift}, 80%, 70%),
                hsl(${hueShift + 120}, 80%, 50%),
                hsl(${hueShift + 240}, 80%, 30%),
                hsl(${hueShift}, 80%, 70%)
              )
            `,
            animation: playing && !reducedMotion ? "slow-spin 20s linear infinite" : "none",
            opacity: intensity * 0.8,
          }}
        />
        
        {/* Noise overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, transparent 0%, rgba(255,255,255,0.1) 1%, transparent 2%),
              radial-gradient(circle at 75% 75%, transparent 0%, rgba(255,255,255,0.1) 1%, transparent 2%)
            `,
            backgroundSize: "4px 4px, 6px 6px",
            animation: playing && !reducedMotion ? "star-streaks 3s linear infinite" : "none",
            opacity: noise * 0.5,
          }}
        />
      </div>
      
      {/* Debug info */}
      <div className="absolute top-4 left-4 text-white/70 text-xs bg-black/30 px-2 py-1 rounded">
        CSS Fallback | Intensity: {intensity.toFixed(2)} | Playing: {playing ? "Yes" : "No"}
      </div>
    </div>
  );
}
