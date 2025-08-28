// pages/routes/index.jsx
import React from "react";
import { PortalLink } from "@/components/Transitions";
import { AUDIENCE_SLUGS, audienceMeta } from "@/content/routes";

export default function RoutesIndex() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-10">
      <div className="mb-3 text-xs tracking-wide text-emerald-300/80">
        PHAMBILI · ROUTES
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-emerald-100 mb-2">
        Choose Your Route
      </h1>
      <p className="text-emerald-100/80 mb-10">
        Select the guided journey that best matches your role and interests.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AUDIENCE_SLUGS.map((audience) => {
          const meta = audienceMeta[audience];
          return (
            <PortalLink
              key={audience}
              href={`/routes/${audience}`}
              className="group relative rounded-2xl border border-emerald-400/15 bg-white/5 dark:bg-emerald-900/20 backdrop-blur-sm p-6 hover:bg-emerald-900/30 hover:border-emerald-400/30 transition-all duration-300"
            >
              <div className="mb-4 text-xs tracking-wide text-emerald-300/80 uppercase">
                {audience}
              </div>
              <h3 className="text-xl font-semibold text-emerald-100 mb-3 group-hover:text-emerald-50 transition-colors">
                {meta?.title || `Prospective ${audience.charAt(0).toUpperCase() + audience.slice(1)}`}
              </h3>
              <p className="text-emerald-100/60 text-sm mb-4">
                A guided route tailored to {audience}s. Follow the five steps below — each includes a short explainer and a call to action.
              </p>
              <div className="flex items-center text-emerald-300/80 text-sm group-hover:text-emerald-200 transition-colors">
                Start Journey →
              </div>
            </PortalLink>
          );
        })}
      </div>

      <div className="mt-10 flex gap-3">
        <PortalLink
          href="/"
          className="rounded-md px-3 py-2 text-sm bg-white/10 hover:bg-white/15 text-emerald-50 border border-white/20 transition"
        >
          ← Back to Home
        </PortalLink>
      </div>
    </div>
  );
}

// Have PageShell render the header & footer
RoutesIndex.shell = {
  kicker: "Website Routes",
  title: "Guided Journeys",
  subtitle: "Choose your route and follow the five steps.",
  showNav: true,
  showFooter: true,
};
