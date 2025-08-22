// components/Layout/PhambiliLayout.jsx
import React from "react";

/**
 * Structural layout wrapper.
 * Background is now handled globally in globals.css,
 * so this component just ensures full-viewport sizing.
 */
export default function PhambiliLayout({ children, className = "", style = {} }) {
  return (
    <div
      className={[
        "relative min-h-screen w-screen overflow-visible",
        className,
      ].join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}
