// pages/_app.js
import "@/styles/globals.css";
import "@/styles/phambili_portal.css";
import "@/styles/phambili_portal_rings.css";

import React from "react";
import { ThemeProvider as DesignTokens } from "@/context/ThemeContext"; // static tokens only
import { PortalTransitionProvider } from "@/components/Transitions"; 
import FullBleedStage from "@/components/Layout/FullBleedStage";
import PageShell from "@/components/Layout/PageShell";

export default function App({ Component, pageProps }) {
  const shell = Component.shell || {};
  const useShell = shell.useShell !== false;

  return (
    <DesignTokens>
      <PortalTransitionProvider>
        {/* ✅ Global test.js background + glow for ALL pages */}
        <FullBleedStage>
          {useShell ? (
            <PageShell {...shell}>
              <Component {...pageProps} />
            </PageShell>
          ) : (
            <Component {...pageProps} />
          )}
        </FullBleedStage>
      </PortalTransitionProvider>
    </DesignTokens>
  );
}
