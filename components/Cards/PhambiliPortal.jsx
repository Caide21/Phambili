import { useState } from "react";
import Link from "next/link";

/**
 * Single-spin portal: the entire SVG ring rotates as one unit.
 * Uses Tailwind keyframes you already have (slow-spin, portal-pulse, breathe, ripple).
 *
 * Props:
 * - href?: string
 * - label?: string
 * - size?: number|string
 * - className?: string
 * - ringSrc?: string (defaults to your current filename)
 * - animated?: boolean
 */
export default function PhambiliPortal({
  href = "#",
  label = "Enter Portal",
  size = 320,
  className = "",
  ringSrc = "/brand/Phambili_Portal.svg",
  animated = true,
}) {
  const [ripples, setRipples] = useState([]);
  const resolved = typeof size === "number" ? `${size}px` : size;

  const onClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Math.random().toString(36).slice(2);
    setRipples((xs) => [
      ...xs,
      { id, x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 },
    ]);
    setTimeout(() => setRipples((xs) => xs.filter((z) => z.id !== id)), 750);
  };

  const core = (
    <div
      className={[
        "relative grid place-items-center select-none rounded-full",
        animated ? "animate-portal-pulse" : "",
        "transition-[filter,transform] duration-500 hover:brightness-[1.04] hover:drop-shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
        className,
      ].join(" ")}
      style={{ width: resolved, height: resolved }}
      onClick={onClick}
      role="button"
      aria-label={label}
      tabIndex={0}
    >
      {/* exact SVG ring, whole element spins */}
      <img
        src={ringSrc}
        alt=""
        className={`absolute inset-0 h-full w-full ${animated ? "animate-slow-spin" : ""}`}
        draggable={false}
      />

      {/* subtle hover breathe halo */}
      {animated && <div className="absolute inset-0 rounded-full hover:animate-breathe" />}

      {/* inner content plate */}
      <div className="relative z-10 grid place-items-center rounded-full" style={{ width: "70%", height: "70%" }}>
        <div className="absolute inset-0 rounded-full bg-white/25 backdrop-blur-[1px]" />
        <div className="relative text-center">
          <div className="text-[10px] tracking-[0.3em] uppercase text-emerald-800/70">Phambili</div>
          <div className="mt-1 text-lg font-semibold text-emerald-900">{label}</div>
        </div>
      </div>

      {/* click ripples */}
      {ripples.map(({ id, x, y }) => (
        <span
          key={id}
          className="pointer-events-none absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/35 animate-ripple"
          style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
        />
      ))}
    </div>
  );

  return href ? <Link href={href} aria-label={label}>{core}</Link> : core;
}
