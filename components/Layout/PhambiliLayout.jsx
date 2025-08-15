// components/Layout/PhambiliLayout.jsx
import Head from "next/head";
import Link from "next/link";

export default function PhambiliLayout({
  title = "Phambili",
  description = "Turning municipal waste into clean energy & products.",
  children,
}) {
  return (
    <>
      <Head>
        <title>{title} · Phambili</title>
        <meta name="description" content={description} />
      </Head>

      {/* Background */}
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50/40 relative">
        {/* soft blue aura */}
        <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_40%_at_50%_0%,theme(colors.sky.100/.8),transparent)]" />

        {/* Top nav */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-emerald-100">
          <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="group inline-flex items-center gap-2">
              {/* If you have a portal SVG, point src to it (e.g. /brand/phambili-portal.svg) */}
              <span className="relative grid h-8 w-8 place-items-center rounded-full ring-1 ring-emerald-200/60">
                <span className="absolute inset-0 rounded-full bg-sky-100/40 group-hover:bg-sky-200/40 transition-colors" />
                <span className="relative h-3 w-3 rounded-full bg-emerald-500/90 shadow-[0_0_12px_theme(colors.sky.300)]" />
              </span>
              <span className="text-emerald-900 font-semibold tracking-wide">Phambili</span>
            </Link>

            <div className="flex items-center gap-5 text-sm">
              {[
                ["Technology", "/technology"],
                ["Impact", "/impact"],
                ["Applications", "/applications"],
                ["Contact", "/contact-sales"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-emerald-800/80 hover:text-emerald-900 transition-colors hover:underline underline-offset-4 decoration-sky-400/60"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        {/* Content container */}
        <main className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 py-10">
          {/* subtle top accent line (blue hint) */}
          <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-sky-300/60 via-emerald-300/60 to-sky-300/60 mb-6" />
          {children}
        </main>

        {/* Footer */}
        <footer className="mx-auto max-w-7xl px-4 sm:px-6 py-10 text-sm text-emerald-900/70">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-emerald-100 pt-6">
            <p>© {new Date().getFullYear()} Phambili. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-sky-700/80">Privacy</Link>
              <Link href="/terms" className="hover:text-sky-700/80">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
