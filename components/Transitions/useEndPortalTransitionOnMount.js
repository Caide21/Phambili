import React, { useContext, useEffect } from "react";
import { PortalTransitionContext } from "./PortalTransitionProvider";

// Safe: may be called on every mount, optionally disabled.

export default function useEndPortalTransitionOnMount(delayMs = 0, enabled = true) {
    const ctx = useContext(PortalTransitionContext) || { end: () => {} };
    useEffect(() => {
        if (!enabled) return;
        const t = setTimeout(() => ctx.end?.(), delayMs);
        return () => clearTimeout(t);
        }, [ctx, delayMs, enabled]);
}
