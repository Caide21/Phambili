// pages/technology.jsx
import PhambiliLayout from "@/components/Layout/PhambiliLayout";
import PageShell from "@/components/Layout/PageShell";

export default function Technology() {
  return (
    <PhambiliLayout title="Technology" description="Biomass Conversion Technology (BCT) overview.">
      <PageShell
        kicker="BCT"
        title="Technology"
        subtitle="Modular systems that convert municipal waste into clean energy and circular products."
        actions={
          <a
            href="/contact-sales"
            className="inline-flex items-center rounded-full px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Contact sales
          </a>
        }
      >
        <div className="prose prose-emerald max-w-none">
          <p>
            Our BCT platform accepts mixed organics and select plastics, producing clean gas, process heat, and biochar.
            Systems are modular, rapidly deployable, and tuned for municipal operations.
          </p>
          <ul>
            <li>Waste stream audit & siting</li>
            <li>Modular deployment and grid integration</li>
            <li>Off-take agreements and MRV</li>
          </ul>
        </div>
      </PageShell>
    </PhambiliLayout>
  );
}
