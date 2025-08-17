// components/Visualizer/SafetyBar.jsx
// Top banner with pause/panic buttons, intensity meter, and safety disclaimer
// Shows reduced motion indicator when active

import React from "react";

// Intensity meter component
function IntensityMeter({ intensity, reducedMotion }) {
  const maxIntensity = reducedMotion ? 0.3 : 0.85;
  const percentage = Math.round((intensity / maxIntensity) * 100);
  
  // Color based on intensity level
  const getColor = (level) => {
    if (level < 30) return "bg-emerald-500";
    if (level < 60) return "bg-yellow-500";
    if (level < 80) return "bg-orange-500";
    return "bg-red-500";
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/70">Intensity:</span>
      <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(percentage)} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-white/70 min-w-[2.5rem]">
        {percentage}%
      </span>
    </div>
  );
}

// Button component for safety bar
function SafetyButton({ children, onClick, variant = "primary", disabled = false, className = "" }) {
  const baseClasses = "px-3 py-1.5 text-xs font-medium rounded-md transition-colors";
  const variantClasses = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
    secondary: "bg-white/10 hover:bg-white/20 text-white/90",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

export default function SafetyBar({
  playing,
  intensity,
  onPlayPause,
  onPanicStop,
  reducedMotion,
}) {
  return (
    <div className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-2 bg-black/50 text-white text-sm backdrop-blur-sm border-b border-white/10">
      {/* Left side - Controls */}
      <div className="flex items-center gap-3">
        <SafetyButton
          onClick={onPlayPause}
          variant="primary"
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </SafetyButton>
        
        <SafetyButton
          onClick={onPanicStop}
          variant="danger"
        >
          🚨 Panic Stop
        </SafetyButton>
        
        <IntensityMeter intensity={intensity} reducedMotion={reducedMotion} />
      </div>

      {/* Center - Disclaimer */}
      <div className="hidden sm:block text-center text-xs text-white/70 max-w-md">
        <span className="font-medium">⚠️ Safety Notice:</span>{" "}
        Visualization tool for art/research. Not medical advice. May be intense. 
        Use "Panic Stop" or reduce motion if uncomfortable.
      </div>

      {/* Right side - Status indicators */}
      <div className="flex items-center gap-2">
        {reducedMotion && (
          <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
            Reduced Motion Active
          </span>
        )}
        
        <span className="text-xs text-white/50">
          {playing ? "● Live" : "○ Paused"}
        </span>
      </div>

      {/* Mobile disclaimer (shown on small screens) */}
      <div className="sm:hidden absolute top-full left-0 right-0 bg-black/80 text-xs text-white/70 p-2 text-center border-b border-white/10">
        <span className="font-medium">⚠️ Safety:</span> Use "Panic Stop" if uncomfortable.
      </div>
    </div>
  );
}
