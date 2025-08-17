// components/Layout/FullBleedStage.jsx
// Full-bleed, zoom-safe stage with viewport-driven CSS variables.
// Applies to EVERYTHING because we'll mount it at the app root.

import React from "react";

export default function FullBleedStage({ className = "", style = {}, children }) {
  return (
    <div
      // Fixed + inset-0 makes this the single full-viewport surface (like ChatGPT)
      className={`fixed inset-0 w-screen h-screen overflow-visible ${className}`}
      style={{
        // ----- Global cluster/stage variables (tweak once, used everywhere) -----
        ["--portal-size"]: "clamp(140px, 18vmin, 260px)",
        ["--orbit-radius"]:
          "clamp(calc(var(--portal-size)*0.9), 36vmin, calc(50vmin - calc(var(--portal-size)/2) - 12px))",
        ...style,
      }}
      aria-label="Full Bleed Stage"
    >
      {children}
    </div>
  );
}
