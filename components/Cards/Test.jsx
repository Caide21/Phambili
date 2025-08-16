import React, { useEffect, useRef } from "react";

/**
 * Uses the original Phambili portal SVG (same art as sandbox),
 * inlines it, then wraps each ring <path> in a <g> so we can
 * rotate them independently in alternating directions.
 *
 * Instead of trying to “add the missing pieces” to broken paths,
 * we keep the original art and simply rotate each ring group.
 */
export default function Test({
  size = 1024,
  alternate = true,                         // false = all clockwise
  svgFile = "/brand/Phambili_Portal.svg",   // same path your sandbox uses
  ariaLabel = "Phambili portal (brand SVG with alternating rings)",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(svgFile);
        const svgText = await res.text();
        if (cancelled || !containerRef.current) return;

        // Inline the SVG
        containerRef.current.innerHTML = svgText;
        const svg = containerRef.current.querySelector("svg");
        if (!svg) return;

        // Make sizing predictable
        svg.classList.add("phambili-portal");
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", ariaLabel);
        svg.setAttribute("width", String(size));
        svg.setAttribute("height", String(size));

        // Wrap each path in a <g> and assign spin / spin-rev
        const paths = Array.from(svg.querySelectorAll("path"));
        paths.forEach((path, i) => {
          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          const parent = path.parentNode;
          parent.replaceChild(g, path);
          g.appendChild(path);

          const clockwise = !alternate || i % 2 === 0;
          g.setAttribute("class", clockwise ? "spin" : "spin-rev");

          // Nice drift: different speeds per ring (tweak as you like)
          g.style.animationDuration = `${18 + i * 4}s`;
        });
      } catch (err) {
        console.error("Failed to inject brand SVG:", err);
      }
    }

    load();
    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [svgFile, size, alternate, ariaLabel]);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "inline-block",
        lineHeight: 0,
      }}
      aria-label={ariaLabel}
    >
      <div ref={containerRef} />
    </div>
  );
}
