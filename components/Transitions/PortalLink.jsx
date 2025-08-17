// components/Transitions/PortalLink.jsx
//PortalLink = wraps any element; on click, plays the portal transition then navigates.
//Usage: <PortalLink href="/technology"><PhambiliPortal .../></PortalLink>

import React from "react";
import { usePortalTransition } from "./PortalTransitionProvider";

export default function PortalLink({ href, children, className = "", duration = 900 }) {
  const { start } = usePortalTransition();

  return (
    <button
      type="button"
      onClick={() => start(href, { duration })}
      className={["group", "cursor-pointer", "outline-none", className].join(" ")}
      aria-label="Enter portal"
    >
      {children}
    </button>
  );
}
