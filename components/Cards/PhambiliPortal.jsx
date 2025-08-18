// components/Cards/PhambiliPortal.jsx
import React from "react";

/**
 * PhambiliPortal (visual-only)
 * - No <a> inside (cluster owns the link wrapper)
 * - You can swap `src` to your exact asset; defaults to /brand/Phambili_Portal.svg
 */
export default function PhambiliPortal({
  label = "Enter Portal",
  size = 220,                 // px
  src = "/brand/Phambili_Portal.svg",
  className = "",
  showPlate = true,
}) {
  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      {/* Rotating ring art */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          filter: "drop-shadow(0 0 10px rgba(39, 255, 171, 0.25))",
          animation: "phambili-portal-spin 22s linear infinite",
        }}
      />

      {/* Inner plate */}
      {showPlate && (
        <div
          className="absolute inset-0 grid place-items-center"
          aria-hidden="true"
        >
          <div className="rounded-full px-3 py-2 text-center"
               style={{
                 background: "rgba(10, 40, 32, 0.55)",
                 boxShadow: "inset 0 0 0 1px rgba(56,255,172,0.20)",
                 backdropFilter: "blur(2px)",
               }}>
            <div className="text-[10px] tracking-[0.25em] text-emerald-300/70 mb-0.5">PHAMBILI</div>
            <div className="text-sm text-emerald-100/90 font-medium">{label}</div>
          </div>
        </div>
      )}

      {/* Local keyframes */}
      <style jsx>{`
        @keyframes phambili-portal-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
