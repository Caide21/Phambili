// components/Layout/PhambiliLayout.jsx
// Single-owner layout: fixed Nav overlay + full-bleed stage for all pages.

import React from "react";
import Nav from "@/components/Nav/Nav";

export default function PhambiliLayout({ children, className = "" }) {
  return (
    <div className={`w-screen h-screen overflow-hidden ${className}`}>
      {/* Fixed nav overlay (doesn't consume layout height) */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Nav />
      </header>

      {/* Full-bleed stage directly under the nav */}
      <div
        className="relative w-screen h-[100svh]"
        style={{
          // Global, zoom-safe variables used by pages/components:
          ["--portal-size"]: "clamp(140px, 18vmin, 260px)",
          ["--orbit-radius"]:
            "clamp(calc(var(--portal-size)*0.9), 36vmin, calc(min(50svmin,50vmin) - calc(var(--portal-size)/2) - 12px))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
