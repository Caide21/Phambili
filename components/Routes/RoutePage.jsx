// components/Routes/RoutePage.jsx
import { PortalLink, useEndPortalTransitionOnMount } from "@/components/Transitions";

export default function RoutePage({
  kicker = "Phambili · Route",
  title = "Guided Journey",
  intro = "Follow the five steps below.",
  steps = [],
  autoEndTransition = true, // toggle teardown on mount
}) {
  // Ensure any in-flight overlay ends shortly after mount (cannot beat minDuration)
  useEndPortalTransitionOnMount(400, autoEndTransition);

  return (
    <div className="relative z-10 mx-auto max-w-[1100px] px-6 py-10">
      {kicker && (
        <div className="mb-3 text-xs tracking-wide text-emerald-200/80">
          {kicker}
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold text-emerald-50 mb-2">
        {title}
      </h1>

      {intro && <p className="text-emerald-100/90 mb-6">{intro}</p>}

      {Array.isArray(steps) && steps.length > 0 ? (
        steps.map((step, i) => (
          <section
            key={step.title || i}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-950/40 backdrop-blur-sm p-6 mb-6"
          >
            <div className="mb-2 text-xs tracking-wide text-emerald-200/80">
              STEP {i + 1} / {steps.length}
            </div>

            <h3 className="text-xl font-semibold text-emerald-50 mb-2">
              {step.title}
            </h3>

            {step.blurb && (
              <p className="text-emerald-100/90">{step.blurb}</p>
            )}

            {/* Primary CTA uses PortalLink to trigger transition */}
            {step.cta?.href && step.cta?.label && (
              <div className="mt-4">
                <PortalLink
                  href={step.cta.href}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm
                    bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-50
                    border border-emerald-300/40 transition"
                >
                  {step.cta.label} →
                </PortalLink>
              </div>
            )}

            {/* Optional secondary links (also animated) */}
            {Array.isArray(step.links) && step.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {step.links.map((lnk, li) =>
                  lnk?.href && lnk?.label ? (
                    <PortalLink
                      key={li}
                      href={lnk.href}
                      className="rounded-md px-2.5 py-1.5 text-xs
                        bg-white/10 hover:bg-white/15 text-emerald-50 border border-white/20 transition"
                    >
                      {lnk.label}
                    </PortalLink>
                  ) : null
                )}
              </div>
            )}
          </section>
        ))
      ) : (
        <div className="rounded-xl border border-white/15 bg-white/5 p-6 text-emerald-100/90">
          No steps configured yet.
        </div>
      )}

      {/* Page-level navigations (animated) */}
      <div className="mt-10 flex gap-3">
        <PortalLink
          href="/"
          className="rounded-md px-3 py-2 text-sm bg-white/10 hover:bg-white/15 text-emerald-50 border border-white/20 transition"
        >
          ← Back to Home
        </PortalLink>

        <PortalLink
          href="/contact"
          className="rounded-md px-3 py-2 text-sm bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-50 border border-emerald-300/40 transition"
        >
          Talk to the Team
        </PortalLink>
      </div>
    </div>
  );
}
