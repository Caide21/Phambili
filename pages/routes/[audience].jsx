// /pages/routes/[audience].jsx
import React from "react";
import { PortalLink } from "@/components/Transitions";
import { useRouter } from "next/router";
import { AUDIENCE_SLUGS, audienceMeta, routesData } from "@/content/routes";

function StepCard({ step, index, total }) {
  return (
    <section className="relative rounded-2xl border border-emerald-400/15 bg-white/5 dark:bg-emerald-900/20 backdrop-blur-sm p-5 sm:p-6 mb-6">
      <div className="mb-2 text-xs tracking-wide text-emerald-300/80">
        STEP {index + 1} / {total}
      </div>
      <h3 className="text-xl font-semibold text-emerald-100 mb-2">{step.title}</h3>
      <p className="text-emerald-100/80">{step.blurb}</p>
      {step.cta?.href && (
        <div className="mt-4">
          <PortalLink
            href={step.cta.href}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm
                       bg-emerald-300/20 hover:bg-emerald-300/30
                       text-emerald-50 border border-emerald-300/30 transition"
          >
            {step.cta.label} →
          </PortalLink>
        </div>
      )}
    </section>
  );
}

function ProgressRail({ steps, currentIndex = 0 }) {
  return (
    <div className="relative my-6">
      <div className="h-[2px] w-full bg-emerald-300/20" />
      <div className="absolute inset-0 flex justify-between">
        {steps.map((s, i) => (
          <div key={s.id} className="relative -top-2">
            <div
              className={[
                "h-3 w-3 rounded-full border",
                i <= currentIndex
                  ? "bg-emerald-300 border-emerald-200"
                  : "bg-emerald-900/40 border-emerald-400/30",
              ].join(" ")}
              title={`${i + 1}. ${s.title}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AudienceRoutePage({ audience, meta, steps }) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-10">
      <div className="mb-3 text-xs tracking-wide text-emerald-300/80">
        {meta.kicker}
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-emerald-100 mb-2">
        {meta.title}
      </h1>
      <p className="text-emerald-100/80">
        A guided route tailored to {audience}. Follow the five steps below — each
        includes a short explainer and a call to action.
      </p>

      <ProgressRail steps={steps} />

      <div className="mt-6">
        {steps.map((step, i) => (
          <StepCard key={step.id} step={step} index={i} total={steps.length} />
        ))}
      </div>

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

// --- Next.js data hooks (static generation) ---
export async function getStaticPaths() {
  const norm = (s) => String(s || '')
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '');

  const unique = Array.from(
    new Set((AUDIENCE_SLUGS || []).filter(Boolean).map(norm))
  );

  // If someone reintroduces duplicates upstream, fail locally with a clear error:
  if (unique.length !== (AUDIENCE_SLUGS || []).filter(Boolean).length) {
    console.warn('[getStaticPaths] Duplicates were removed from AUDIENCE_SLUGS; please fix the source list.');
  }

  const paths = unique.map(audience => ({ params: { audience } }));
  return { paths, fallback: false };
}


export async function getStaticProps({ params }) {
  const audience = params.audience;
  const meta = audienceMeta[audience] ?? { title: "Phambili Route", kicker: "" };
  const steps = routesData[audience] ?? [];
  return {
    props: { audience, meta, steps },
  };
}

// Have PageShell render the header & footer
AudienceRoutePage.shell = {
  kicker: "Website Routes",
  title: "Guided Journeys",
  subtitle: "Choose your route and follow the five steps.",
  showNav: true,
  showFooter: true,
};
