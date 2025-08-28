// pages/index.js
import React from "react";
import PortalCluster from "@/components/Clusters/PortalCluster";
import { PortalLink } from "@/components/Transitions"; // ✅ keep this one

export default function Home() {
  const portals = [
    { id: "investor", label: "Investor", href: "/routes/investor", size: 140 },
    { id: "partner", label: "Partner", href: "/routes/partner", size: 140 },
    { id: "buyer", label: "Product Buyer", href: "/routes/buyer", size: 140 },
    { id: "supplier", label: "Feedstock Supplier", href: "/routes/supplier", size: 140 },
  ];

  return (
    <main className="relative min-h-[70vh] flex items-center justify-center">
      <PortalCluster
        portals={portals}
        /* Layout / placement */
        top="50%"
        left="50%"
        defaultRadius={180}
        defaultSize={140}
        autoLayout
        layoutStartAngle={-90}

        /* Interaction / visuals */
        draggable={false}
        scalable
        blendMode="screen"
        showReactor={false}

        /* Use transition-aware link */
        wrapWithAnchor
        LinkComponent={PortalLink}

        className="z-10"
      />
    </main>
  );
}

Home.shell = {
  kicker: "WELCOME TO PHAMBILI",
  title: "Choose Your Route",
  subtitle: "Select the journey that best matches your role.",
  showNav: true,
  showFooter: true,
};
