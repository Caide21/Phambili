// components/Scene/ReactorPlaceholder.jsx
import React from "react";

export default function ReactorPlaceholder() {
  return (
    <div className="reactor flex items-center justify-center rounded-full">
      <div className="reactor-core" />
      <div className="reactor-ring ring-1" />
      <div className="reactor-ring ring-2" />
      <div className="reactor-ring ring-3" />
      <span className="reactor-label">Reactor Core</span>
    </div>
  );
}
