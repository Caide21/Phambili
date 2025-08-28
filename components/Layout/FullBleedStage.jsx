// components/Layout/FullBleedStage.jsx
import React from "react";

export default function FullBleedStage({ children, className = "" }) {
  return (
    <div className={`relative w-screen min-h-[100svh] overflow-visible ${className}`}>
      {/* Background layers */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {/* Softer emerald glow */}
        <div className="absolute inset-0 bg-[radial-gradient(65%_65%_at_50%_35%,rgba(16,185,129,0.35),transparent_65%)]" />
        {/* Lighter emerald gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-700/40 via-emerald-900/50 to-emerald-950/80" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-10 [mask-image:radial-gradient(85%_85%_at_50%_40%,#000_30%,transparent_100%)]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Lighter vignette */}
        <div className="absolute inset-0 [mask-image:radial-gradient(120%_120%_at_50%_40%,#000_20%,transparent_100%)] bg-black/20" />
      </div>

      {children}
    </div>
  );
}