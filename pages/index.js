// pages/index.js
import React from "react";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";
import FullBleedStage from "@/components/Layout/FullBleedStage";
import PortalCluster from "@/components/Clusters/PortalCluster";

// Keep the transition effect; remove these two lines if you’re not using it.
import { PortalTransitionProvider } from "@/components/Transitions/PortalTransitionProvider";
import PortalLink from "@/components/Transitions/PortalLink";

export default function Home() {
  // Minimal items — cluster auto-forms a polygon and centers on the page.
  const portals = [
    { id: "p1", label: "Portal 1", href: "/sandbox" },
    { id: "p2", label: "Portal 2", href: "/sandbox" },
    { id: "p3", label: "Portal 3", href: "/sandbox" },
    { id: "p4", label: "Portal 4", href: "/sandbox" },
    { id: "p5", label: "Portal 5", href: "/sandbox" },
  ];

  return (
    <ThemeProvider>
      <PortalTransitionProvider>
        <FullBleedStage className="bg-gradient-to-bl from-[#041F1A] via-[#062821] to-[#04140F] overflow-hidden">
          {/* Subtle radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 60% 40%, rgba(16,175,110,0.20) 0%, rgba(0,0,0,0) 60%)",
            }}
          />

          {/* Centered cluster; ensure PortalCluster's outer wrapper uses translate(-50%,-50%) */}
          <PortalCluster
            id="cluster-home"
            top="50%"
            left="50%"
            initial={{ x: 0, y: 0, scale: 1 }}
            portals={portals}
            draggable={false}
            scalable={true}
            wrapWithAnchor
            LinkComponent={PortalLink}
            blendMode="screen"
            showBuiltInScale={false}
            showReactor={false}
          />
        </FullBleedStage>
      </PortalTransitionProvider>
    </ThemeProvider>
  );
}
