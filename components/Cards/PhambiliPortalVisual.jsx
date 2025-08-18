// components/Cards/PhambiliPortalVisual.jsx
// Visual-only portal. No <a> inside. Safe for PortalCluster to wrap with links.

import React from "react";
import ThemeablePortalSVG from "@/components/svg/PhambiliPortalRingifiedRingedThemeable";

export default function PhambiliPortalVisual({ size = 140, ...rest }) {
  return <ThemeablePortalSVG size={size} {...rest} />;
}
