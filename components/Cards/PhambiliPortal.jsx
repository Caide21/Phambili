import Link from "next/link";

/**
 * PhambiliPortal
 * Default: single, unified spin using an <img src="/brand/Phambili_Portal.svg">
 *
 * Later (optional): switch to a ringed SVG via SVGR and enable the
 * commented "alternate spin" block in the CSS.
 */
export default function PhambiliPortal({
  href = "/contact-sales",
  label = "Enter Portal",
  size = 380,                  // px or any CSS size string
  src = "/brand/Phambili_Portal.svg",
  className = "",
  showPlate = true,
}) {
  const resolved = typeof size === "number" ? `${size}px` : size;

  const core = (
    <div
      className={[
        "phambili-portal select-none",
        "transition-[filter,transform] duration-500 hover:brightness-[1.04] hover:drop-shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
        className,
      ].join(" ")}
      style={{ width: resolved, height: resolved }}
      role="img"
      aria-label="Phambili Portal"
      tabIndex={0}
    >
      {/* Single unified spin: rotate the whole image */}
      <img src={src} alt="Phambili Portal" className="phambili-portal__rotor" />

      {showPlate && <div className="phambili-portal__plate" />}

      {/* Center text (optional) */}
      <div
        className="pointer-events-none absolute inset-0 grid place-items-center"
        aria-hidden="true"
      >
        <div className="text-center">
          <div className="text-[10px] tracking-[0.3em] uppercase text-emerald-800/70">Phambili</div>
          <div className="mt-1 text-lg font-semibold text-emerald-900">{label}</div>
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} aria-label={label}>
      {core}
    </Link>
  ) : (
    core
  );
}

/* =========================================================
   OPTIONAL (enable later): ringed SVG with alternate spin
   ---------------------------------------------------------
   1) Export a ringed SVG from Figma (groups named ring-1..N)
   2) Add SVGR loader in next.config.js (if not already)
   3) Replace the <img> above with this inline SVG import:

   import PortalRinged from "@/public/brand/phambili-portal.ringed.svg";

   <div className="phambili-portal__svg">
     <PortalRinged />
   </div>

   4) After render, tag rings alternately (example):

   useEffect(() => {
     const svg = wrapRef.current?.querySelector("svg");
     if (!svg) return;
     const rings = Array.from(svg.querySelectorAll('g[id^="ring-"]'))
       .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
     rings.forEach((g, i) => {
       g.classList.remove("cw", "ccw");
       g.classList.add(i % 2 === 0 ? "cw" : "ccw");
       g.style.setProperty("--dur", `${24 + (i % 6) * 2}s`);
     });
   }, []);

   5) Uncomment the "per-ring alternate spin" block in CSS.
   ========================================================= */
