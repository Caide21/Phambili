import React, { useContext } from "react";
import { useRouter } from "next/router";
import { PortalTransitionContext } from "./PortalTransitionProvider";

/**
 * On click:
 *  - prevents default (unless modified-click)
 *  - calls start(href) which animates + pushes after a small delay
 */
export default function PortalLink({ href, children, className = "", ...rest }) {
  const router = useRouter();
  const context = useContext(PortalTransitionContext);
  
  console.log("🔗 PortalLink render:", { href, context: !!context, contextStart: !!context?.start });
  
  const onClick = (e) => {
    console.log("🎯 PortalLink onClick triggered:", { href, target: e.target });
    
    if (
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
      (rest.target && rest.target !== "_self")
    ) {
      console.log("🚀 Modified click detected, allowing default behavior");
      return;
    }
    
    console.log("🛑 Preventing default and starting transition");
    e.preventDefault();
    
    if (context && context.start) {
      console.log("✅ Starting portal transition to:", href);
      context.start(href);
    } else {
      console.error("❌ No PortalTransitionContext found or start function missing!");
      console.log("Context:", context);
    }
  };

  return (
    <a
      href={typeof href === "string" ? href : "/"}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}