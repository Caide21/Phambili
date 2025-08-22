import React, { useContext } from "react";
import { useRouter } from "next/router";
import { PortalTransitionContext } from "./PortalTransitionProvider";

/**
 * On click:
 *  - prevents default (unless modified-click)
 *  - calls start(href) which animates + pushes after a small delay
 */
export default function PortalLink({ href, children, className = "", ...rest }) {
  const router = useRouter(); // optional: used to compute current path for href fallback
  const { start } = useContext(PortalTransitionContext);

  const onClick = (e) => {
    if (
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
      (rest.target && rest.target !== "_self")
    ) {
      // Let the browser handle new tab / etc.
      return;
    }
    e.preventDefault();
    start(href);
  };

  return (
    <a
      href={typeof href === "string" ? href : router.asPath}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
