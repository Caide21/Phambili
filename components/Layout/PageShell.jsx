// components/Layout/PageShell.jsx
//PageShell = the chrome/frame for each page.
//Optionally shows Nav (showNav).
//Provides the page header API (kicker, title, subtitle, actions).
//Now owns the Footer (showFooter).
///Think: “place the furniture, headings, and controls.”
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Layout/Footer";

export default function PageShell({
  kicker,
  title,
  subtitle,
  actions,
  children,
  showNav = true,
  showFooter = true,
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {showNav && <Nav />}

      <main className="flex-grow">
        <section className="mx-auto w-full max-w-[1200px] px-6">
          {/* Header (optional) */}
          {(kicker || title || subtitle || actions) && (
            <div className="pt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                {kicker && (
                  <div className="text-xs uppercase tracking-widest text-sky-700/70">
                    {kicker}
                  </div>
                )}
                {title && (
                  <h1 className="text-3xl md:text-5xl font-semibold text-emerald-900">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-2 max-w-2xl text-emerald-900/80">{subtitle}</p>
                )}
              </div>
              {actions && <div className="mt-2 md:mt-0">{actions}</div>}
            </div>
          )}

          {/* Content area — no white card wrapper */}
          <div className="relative mt-6">{children}</div>
        </section>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
