// pages/sandbox.js
import Link from "next/link";
import PhambiliPortal from "@/components/Cards/PhambiliPortal";

export default function Sandbox() {
  return (
    <div className="grid gap-10 md:grid-cols-[0.95fr_1.05fr]">
      {/* LEFT: Portal demo */}
      <section className="relative rounded-3xl bg-white/90 shadow-sm ring-1 ring-emerald-200/60 p-6 md:p-8 grid place-items-center">
        {/* Bigger, responsive frame for the portal */}
        <div className="mx-auto grid place-items-center w-[520px] h-[520px] max-w-full sm:max-h-[70vh]">
          <div className="text-center">
            <PhambiliPortal
              href="/contact-sales"
              label="Enter Portal"
              size={380}            // a touch larger
              mode="alternate"      // counter-rotate rings (use "single" to lock)
              rings={6}             // tweak 6–8 depending on look
              animated
              isolateOnHover
            />

            <div className="mt-5 text-sm text-emerald-900/75">
              SVG source:{" "}
              <code className="px-2 py-0.5 rounded bg-emerald-50">
                /brand/Phambili_Portal.svg
              </code>
            </div>

            <div className="mt-4">
              <Link
                href="/technology"
                className="inline-flex items-center rounded-full px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Explore Technology
              </Link>
            </div>
          </div>
        </div>

        {/* subtle blue aura */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-sky-200/40 via-transparent to-emerald-200/30 [mask:linear-gradient(#000_0,transparent_65%)]" />
      </section>

      {/* RIGHT: Components palette */}
      <section className="space-y-6">
        {/* Cards */}
        <div className="rounded-3xl bg-white/90 shadow-sm ring-1 ring-emerald-200/60 p-6">
          <h2 className="text-emerald-900 text-lg font-semibold">Quick Cards</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl p-4 bg-emerald-50/60">
              <div className="text-emerald-800 font-medium">Waste → Energy</div>
              <p className="text-emerald-900/80 text-sm mt-1">
                Organics diverted from landfill feed BCT modules.
              </p>
            </div>
            <div className="rounded-2xl p-4 bg-sky-50/60">
              <div className="text-sky-900/90 font-medium">Blue Hint</div>
              <p className="text-emerald-900/80 text-sm mt-1">
                Subtle sky tones layered on primary emerald.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="rounded-3xl bg-white/90 shadow-sm ring-1 ring-emerald-200/60 p-6">
          <h2 className="text-emerald-900 text-lg font-semibold">Sample Metrics</h2>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            {[
              { k: "Waste diverted", v: "50k t/yr" },
              { k: "Power generated", v: "5–10 GWh/yr" },
              { k: "Biochar yield", v: "10–15%" },
            ].map((m) => (
              <div
                key={m.k}
                className="rounded-2xl p-5 bg-gradient-to-b from-emerald-50/70 to-white ring-1 ring-emerald-100"
              >
                <div className="text-2xl font-semibold text-emerald-900">{m.v}</div>
                <div className="text-emerald-800/80 text-sm">{m.k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div className="rounded-3xl bg-white/90 shadow-sm ring-1 ring-emerald-200/60 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-emerald-900 font-semibold">Ready to assess your site?</div>
            <div className="text-emerald-900/75 text-sm">Book a quick call with our team.</div>
          </div>
          <Link
            href="/contact-sales"
            className="inline-flex items-center rounded-full px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Contact sales
          </Link>
        </div>
      </section>
    </div>
  );
}

/**
 * PageShell props consumed by _app.js wrapper:
 * - We set kicker/title/subtitle and optional actions shown in the header band.
 */
Sandbox.shell = {
  kicker: "Sandbox",
  title: "Design Sandbox",
  subtitle: "Playground for Phambili components with a hint of blue.",
  actions: (
    <Link
      href="/impact"
      className="inline-flex items-center rounded-full px-4 py-2 bg-sky-600 text-white hover:bg-sky-700 transition-colors"
    >
      See Impact
    </Link>
  ),
};
