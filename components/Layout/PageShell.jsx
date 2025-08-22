// components/Layout/PageShell.jsx
import Head from "next/head";
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Layout/Footer";

export default function PageShell({
  kicker, title, subtitle, actions, children,
  showNav = true, showFooter = true,
}) {
  const pageTitle = [title, "Phambili"].filter(Boolean).join(" — ");

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
      </Head>

      {showNav && <Nav />}
      <main className="flex-grow">
        <section className="mx-auto w-full max-w-[1200px] px-6">
          {(kicker || title || subtitle || actions) && (
            <div className="pt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                {kicker && (
                  <div className="text-xs uppercase tracking-widest text-emerald-300/80">{kicker}</div>
                )}
                {title && (
                  <h1 className="text-3xl md:text-5xl font-semibold text-emerald-300">{title}</h1>
                )}
                {subtitle && (
                  <p className="mt-2 max-w-2xl text-emerald-200/80">{subtitle}</p>
                )}
              </div>
              {actions && <div className="mt-2 md:mt-0">{actions}</div>}
            </div>
          )}
          <div className="relative mt-6">{children}</div>
        </section>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
