// pages/_app.js
// App = global app wrapper.
// Order (unchanged): ThemeProvider → PortalTransitionProvider → PhambiliLayout → PageShell.
// NEW: FullBleedStage wraps the whole app surface so viewport math & CSS vars apply globally.
//
// ThemeProvider: exposes theme + toggle (dark mode via `class`).
// PortalTransitionProvider: plays the “enter the portal” animation before routing.
// PhambiliLayout: paints background / scene & centers content.
// PageShell: page chrome (Nav / header API / Footer), opt-out with `Component.shell?.useShell === false`.

import "@/styles/globals.css";
import "@/styles/phambili_portal.css";
import "@/styles/phambili_portal_rings.css";
import "@/styles/test.css";
import "@/styles/home.css";
import "@/styles/visualizer.css";

import { ThemeProvider } from "@/components/Theme/ThemeProvider";
import { PortalTransitionProvider } from "@/components/Transitions/PortalTransitionProvider";
import PhambiliLayout from "@/components/Layout/PhambiliLayout";
import PageShell from "@/components/Layout/PageShell";
import FullBleedStage from "@/components/Layout/FullBleedStage";

export default function App({ Component, pageProps }) {
  // Per-page shell settings (pages can set `Page.shell = {...}`)
  const shell = Component.shell || {};
  const useShell = shell.useShell !== false;

  return (
    <ThemeProvider>
      <PortalTransitionProvider>
        {/* Global full-bleed stage (fixed inset-0) so every component shares the same viewport + CSS vars */}
        <FullBleedStage>
          <PhambiliLayout>
            {useShell ? (
              <PageShell {...shell}>
                <Component {...pageProps} />
              </PageShell>
            ) : (
              <Component {...pageProps} />
            )}
          </PhambiliLayout>
        </FullBleedStage>
      </PortalTransitionProvider>
    </ThemeProvider>
  );
}
