// pages/index.js
import React from "react";
import PortalCluster from "@/components/Clusters/PortalCluster";
import PortalLink from "@/components/Transitions/PortalLink";
import PhambiliPortal from "@/components/Cards/PhambiliPortal";     
import { useEndPortalTransitionOnMount } from "@/components/Transitions";

export default function Home() {
  // Kill any in-flight overlay as soon as Home mounts
  useEndPortalTransitionOnMount(0, true);
  const portals = [
    {
      id: "investor",
      label: "Investor",
      href: "/routes/investor",
      component: <PhambiliPortal label="Investor" />,
    },
    {
      id: "partner",
      label: "Partner",
      href: "/routes/partner",
      component: <PhambiliPortal label="Partner" />,
    },
    {
      id: "buyer",
      label: "Product Buyer",
      href: "/routes/buyer",
      component: <PhambiliPortal label="Product Buyer" />,
    },
    {
      id: "supplier",
      label: "Feedstock Supplier",
      href: "/routes/supplier",
      component: <PhambiliPortal label="Feedstock Supplier" />,
    },
  ];

  
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <PortalCluster
        portals={portals}
        wrapWithAnchor
        LinkComponent={PortalLink}
        draggable={false}
        scalable
        blendMode="screen"
        showReactor={false}
      />
    </div>
  );
}

// Keep PageShell header/footer
Home.shell = {
  kicker: "WELCOME TO PHAMBILI",
  title: "Choose Your Route",
  subtitle: "Select the journey that best matches your role.",
  showNav: true,
  showFooter: true,
};
