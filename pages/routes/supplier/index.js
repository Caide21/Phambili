import RoutePage from "@/components/Routes/RoutePage";

const steps = [
  { title: "Why Supply Phambili", blurb: "Reliable demand and fair pricing.", cta: { label: "Supplier Guide", href: "/applications" } },
  { title: "Feedstock & Origins", blurb: "Accepted types, specs, and volumes.", cta: { label: "Accepted Feedstocks", href: "/applications" } },
  { title: "Risk & Mitigation", blurb: "Quality checks, contamination controls.", cta: { label: "QA Process", href: "/technology" } },
  { title: "Growth & Scaling", blurb: "Ramping volumes and multi‑region intake.", cta: { label: "Intake Plan", href: "/impact" } },
  { title: "Next Steps", blurb: "Onboarding, logistics setup, and contracts.", cta: { label: "Get Onboarded", href: "/contact" } },
];

export default function SupplierRoute() {
  return <RoutePage kicker="Phambili · Route" title="Prospective Feedstock Supplier" intro="A guided route tailored to suppliers." steps={steps} />;
}
