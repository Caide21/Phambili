import RoutePage from "@/components/Routes/RoutePage";

const steps = [
  { title: "Why Buy from Phambili", blurb: "Quality, reliability, and ESG value.", cta: { label: "Product Specs", href: "/technology" } },
  { title: "Feedstock → Product", blurb: "Traceability and certification.", cta: { label: "Supply & Logistics", href: "/applications" } },
  { title: "Risk & Mitigation", blurb: "Quality controls, warranties, delivery risk.", cta: { label: "QC & Compliance", href: "/technology" } },
  { title: "Growth & Scaling", blurb: "Volume ramps and multi‑site coverage.", cta: { label: "Capacity Plan", href: "/impact" } },
  { title: "Next Steps", blurb: "Samples, MSDS, and commercial contact.", cta: { label: "Contact Sales", href: "/contact" } },
];

export default function BuyerRoute() {
  return <RoutePage kicker="Phambili · Route" title="Prospective Product Buyer" intro="A guided route tailored to buyers." steps={steps} />;
}
