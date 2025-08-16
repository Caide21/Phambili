// pages/_app.js
import "@/styles/globals.css";
import "@/styles/phambili_portal.css";
import "@/styles/phambili_portal_rings.css";
import "@/styles/test.css";
import "@/styles/home.css";

import { ThemeProvider } from "@/components/Theme/ThemeProvider";
import PhambiliLayout from "@/components/Layout/PhambiliLayout";
import PageShell from "@/components/Layout/PageShell";

export default function App({ Component, pageProps }) {
  // Per-page shell settings (pages can set `Page.shell = {...}`)
  const shell = Component.shell || {};
  const useShell = shell.useShell !== false;

  return (
    <ThemeProvider>
      <PhambiliLayout>
        {useShell ? (
          <PageShell {...shell}>
            <Component {...pageProps} />
          </PageShell>
        ) : (
          <Component {...pageProps} />
        )}
      </PhambiliLayout>
    </ThemeProvider>
  );
}
