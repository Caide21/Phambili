// components/Visualizer/ControlPanel.jsx
// Right-side floating panel with sliders, toggles, and buttons
// Persists state in localStorage and provides share URL functionality

import React, { useState, useEffect } from "react";

// Slider component with label and value display
function Slider({ label, value, min, max, step, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <label className="text-xs font-medium text-white/90 min-w-0 flex-1">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
      />
      <span className="text-xs text-white/70 min-w-[3rem] text-right">
        {typeof value === "number" && value % 1 === 0 ? value : value.toFixed(2)}
      </span>
    </div>
  );
}

// Toggle switch component
function Toggle({ label, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-xs font-medium text-white/90">
        {label}
      </label>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex h-5 w-9 items-center rounded-full transition-colors
          ${checked ? "bg-emerald-500" : "bg-white/20"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`
            inline-block h-3 w-3 transform rounded-full bg-white transition-transform
            ${checked ? "translate-x-5" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}

// Button component
function Button({ children, onClick, variant = "primary", disabled = false, className = "" }) {
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

export default function ControlPanel({
  params,
  onParamChange,
  onRandomize,
  onReset,
  onCopyShareUrl,
  reducedMotion,
}) {
  const [copied, setCopied] = useState(false);

  // Handle copy share URL with feedback
  const handleCopyShareUrl = async () => {
    await onCopyShareUrl();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed right-4 top-20 z-30 w-80 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl p-4 dark:bg-black/30 border border-white/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Controls</h3>
          <div className="flex items-center gap-2">
            {reducedMotion && (
              <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded-full">
                Reduced Motion
              </span>
            )}
          </div>
        </div>

        {/* Intensity Slider */}
        <div className="space-y-1">
          <Slider
            label="Intensity"
            value={params.intensity}
            min={0}
            max={reducedMotion ? 0.3 : 0.85}
            step={0.01}
            onChange={(value) => onParamChange("intensity", value)}
            disabled={false}
          />
          <div className="text-xs text-white/60 px-1">
            {reducedMotion ? "Capped for motion safety" : "Controls overall effect strength"}
          </div>
        </div>

        {/* Kaleidoscope Segments */}
        <Slider
          label="Kaleidoscope"
          value={params.kaleidoSegments}
          min={1}
          max={16}
          step={1}
          onChange={(value) => onParamChange("kaleidoSegments", value)}
        />

        {/* Zoom */}
        <Slider
          label="Zoom"
          value={params.zoom}
          min={0.5}
          max={2.0}
          step={0.01}
          onChange={(value) => onParamChange("zoom", value)}
        />

        {/* Chromatic Aberration */}
        <Slider
          label="Chroma Shift"
          value={params.chromaShift}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => onParamChange("chromaShift", value)}
        />

        {/* Noise/Grain */}
        <Slider
          label="Noise"
          value={params.noise}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => onParamChange("noise", value)}
        />

        {/* Hue Shift */}
        <Slider
          label="Hue Shift"
          value={params.hueShift}
          min={0}
          max={360}
          step={1}
          onChange={(value) => onParamChange("hueShift", value)}
        />

        {/* Toggles */}
        <div className="space-y-1 pt-2 border-t border-white/10">
          <Toggle
            label="Audio Reactive"
            checked={params.audioReactive}
            onChange={(value) => onParamChange("audioReactive", value)}
            disabled={reducedMotion}
          />
          
          <Toggle
            label="Auto Palette Cycle"
            checked={params.autoPaletteCycle}
            onChange={(value) => onParamChange("autoPaletteCycle", value)}
            disabled={reducedMotion}
          />
          
          <Toggle
            label="Motion Safe Mode"
            checked={params.motionSafeMode}
            onChange={(value) => onParamChange("motionSafeMode", value)}
            disabled={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <Button
            onClick={onRandomize}
            disabled={reducedMotion}
            variant="secondary"
            className="flex-1"
          >
            Randomize
          </Button>
          
          <Button
            onClick={onReset}
            variant="secondary"
            className="flex-1"
          >
            Reset
          </Button>
          
          <Button
            onClick={handleCopyShareUrl}
            variant="primary"
            className="flex-1"
          >
            {copied ? "Copied!" : "Share URL"}
          </Button>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="text-xs text-white/50 space-y-1 pt-2 border-t border-white/10">
          <div className="flex justify-between">
            <span>Space</span>
            <span>Play/Pause</span>
          </div>
          <div className="flex justify-between">
            <span>Esc</span>
            <span>Panic Stop</span>
          </div>
          <div className="flex justify-between">
            <span>R</span>
            <span>Randomize</span>
          </div>
        </div>
      </div>
    </div>
  );
}
