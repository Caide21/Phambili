"use client";

// pages/lsd-sim.jsx
// Psychedelic Visualizer - Safe & SSR-Proof
// Full-screen layout with CanvasStage, ControlPanel, and SafetyBar
// Keyboard shortcuts: Space (play/pause), Esc (panic stop), R (randomize)

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import CanvasStage from "@/components/Visualizer/CanvasStage";
import ControlPanel from "@/components/Visualizer/ControlPanel";
import SafetyBar from "@/components/Visualizer/SafetyBar";

// Default parameters - clone for state
export const DEFAULT_PARAMS = {
  playing: true,
  intensity: 0.5,
  kaleidoSegments: 8,
  zoom: 1.0,
  chromaShift: 0.3,
  noise: 0.2,
  hueShift: 0,
  audioReactive: false,
  autoPaletteCycle: false,
  motionSafeMode: false,
};

// Parse URL params on mount, update on changes
function parseUrlParams() {
  if (typeof window === "undefined") return DEFAULT_PARAMS;
  
  const urlParams = new URLSearchParams(window.location.search);
  const params = { ...DEFAULT_PARAMS };
  
  // Parse each param with type conversion
  if (urlParams.has("playing")) params.playing = urlParams.get("playing") === "true";
  if (urlParams.has("intensity")) params.intensity = Math.min(0.85, Math.max(0, parseFloat(urlParams.get("intensity")) || 0));
  if (urlParams.has("kaleidoSegments")) params.kaleidoSegments = Math.min(16, Math.max(1, parseInt(urlParams.get("kaleidoSegments")) || 8));
  if (urlParams.has("zoom")) params.zoom = Math.min(2.0, Math.max(0.5, parseFloat(urlParams.get("zoom")) || 1.0));
  if (urlParams.has("chromaShift")) params.chromaShift = Math.min(1, Math.max(0, parseFloat(urlParams.get("chromaShift")) || 0.3));
  if (urlParams.has("noise")) params.noise = Math.min(1, Math.max(0, parseFloat(urlParams.get("noise")) || 0.2));
  if (urlParams.has("hueShift")) params.hueShift = Math.min(360, Math.max(0, parseFloat(urlParams.get("hueShift")) || 0));
  if (urlParams.has("audioReactive")) params.audioReactive = urlParams.get("audioReactive") === "true";
  if (urlParams.has("autoPaletteCycle")) params.autoPaletteCycle = urlParams.get("autoPaletteCycle") === "true";
  if (urlParams.has("motionSafeMode")) params.motionSafeMode = urlParams.get("motionSafeMode") === "true";
  
  return params;
}

// Update URL with current params
function updateUrlParams(params) {
  if (typeof window === "undefined") return;
  
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlParams.set(key, String(value));
  });
  
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, "", newUrl);
}

// Save to localStorage (guarded)
function saveToLocalStorage(params) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("lsd-sim-params", JSON.stringify(params));
  } catch (e) {
    console.warn("Failed to save to localStorage:", e);
  }
}

// Load from localStorage (guarded)
function loadFromLocalStorage() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("lsd-sim-params");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.warn("Failed to load from localStorage:", e);
    return null;
  }
}

export default function LSDSimulator() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Initialize params from URL/localStorage on mount
  useEffect(() => {
    const urlParams = parseUrlParams();
    const storedParams = loadFromLocalStorage();
    
    // Prefer URL params over localStorage
    const initialParams = { ...DEFAULT_PARAMS, ...storedParams, ...urlParams };
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReducedMotion);
    
    // Apply reduced motion constraints
    if (prefersReducedMotion) {
      initialParams.intensity = Math.min(initialParams.intensity, 0.3);
      initialParams.audioReactive = false;
      initialParams.autoPaletteCycle = false;
      initialParams.motionSafeMode = true;
    }
    
    setParams(initialParams);
  }, []);

  // Update URL and localStorage when params change
  useEffect(() => {
    updateUrlParams(params);
    saveToLocalStorage(params);
  }, [params]);

  // Handle parameter updates
  const updateParam = useCallback((key, value) => {
    setParams(prev => {
      const newParams = { ...prev, [key]: value };
      
      // Apply reduced motion constraints
      if (reducedMotion) {
        if (key === "intensity") newParams.intensity = Math.min(value, 0.3);
        if (key === "audioReactive") newParams.audioReactive = false;
        if (key === "autoPaletteCycle") newParams.autoPaletteCycle = false;
        if (key === "motionSafeMode") newParams.motionSafeMode = true;
      }
      
      return newParams;
    });
  }, [reducedMotion]);

  // Panic stop - reset to safe defaults
  const panicStop = useCallback(() => {
    setParams(prev => ({
      ...DEFAULT_PARAMS,
      playing: false,
      intensity: 0.05,
      audioReactive: false,
      autoPaletteCycle: false,
      motionSafeMode: reducedMotion,
    }));
  }, [reducedMotion]);

  // Randomize palette (only if not reduced motion)
  const randomizePalette = useCallback(() => {
    if (reducedMotion) return;
    
    setParams(prev => ({
      ...prev,
      hueShift: Math.random() * 360,
      chromaShift: Math.random() * 0.6 + 0.2,
      noise: Math.random() * 0.4 + 0.1,
    }));
  }, [reducedMotion]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input fields
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      
      switch (e.code) {
        case "Space":
          e.preventDefault();
          updateParam("playing", !params.playing);
          break;
        case "Escape":
          e.preventDefault();
          panicStop();
          break;
        case "KeyR":
          if (!reducedMotion) {
            e.preventDefault();
            randomizePalette();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [params.playing, updateParam, panicStop, randomizePalette, reducedMotion]);

  // Copy share URL
  const copyShareUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      // Could add a toast notification here
      console.log("Share URL copied to clipboard");
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Psychedelic Visualizer · Phambili</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Safe psychedelic visualizer for art and research. Use with caution." />
      </Head>

      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
        {/* Canvas Stage */}
        <CanvasStage
          playing={params.playing}
          intensity={params.intensity}
          kaleidoSegments={params.kaleidoSegments}
          zoom={params.zoom}
          chromaShift={params.chromaShift}
          noise={params.noise}
          hueShift={params.hueShift}
          audioReactive={params.audioReactive}
          reducedMotion={reducedMotion}
        />

        {/* Safety Bar */}
        <SafetyBar
          playing={params.playing}
          intensity={params.intensity}
          onPlayPause={() => updateParam("playing", !params.playing)}
          onPanicStop={panicStop}
          reducedMotion={reducedMotion}
        />

        {/* Control Panel */}
        <ControlPanel
          params={params}
          onParamChange={updateParam}
          onRandomize={randomizePalette}
          onReset={() => setParams(DEFAULT_PARAMS)}
          onCopyShareUrl={copyShareUrl}
          reducedMotion={reducedMotion}
        />
      </div>
    </>
  );
}

// Disable shell for full-screen experience
LSDSimulator.shell = { useShell: false };
