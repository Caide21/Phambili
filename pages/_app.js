// pages/_app.js
import "@/styles/globals.css";
import "@/styles/phambili_portal.css";
import PhambiliLayout from "@/components/Layout/PhambiliLayout";
import PageShell from "@/components/Layout/PageShell";

export default function App({ Component, pageProps }) {
  // Per-page shell settings (pages can set `Page.shell = {...}`)
  const shell = Component.shell || {};
  const useShell = shell.useShell !== false;

  return (
    <PhambiliLayout
      title={shell.siteTitle || "Phambili"}
      description={shell.siteDescription || "Turning waste into clean energy & products."}
    >
      {useShell ? (
        <PageShell {...shell}>
          <Component {...pageProps} />
        </PageShell>
      ) : (
        <Component {...pageProps} />
      )}
    </PhambiliLayout>
  );
}
