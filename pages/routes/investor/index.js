import RoutePage from "@/components/Routes/RoutePage";

const steps = [
  { title: "Why Phambili", blurb: "Vision, value, and market need.", cta: { label: "Read the Vision", href: "/technology" } },
  { title: "Feedstock & Origins", blurb: "Sourcing, volumes, and logistics.", cta: { label: "See Qualifiers", href: "/applications" } },
  { title: "Risk & Mitigation", blurb: "Technical, regulatory, and execution de‑risking.", cta: { label: "View Safeguards", href: "/technology" } },
  { title: "Growth & Scaling", blurb: "Unit economics, replication, and pipeline.", cta: { label: "Scaling Model", href: "/impact" } },
  { title: "Next Steps", blurb: "Roadmap, data room, and contact.", cta: { label: "Book a Call", href: "/contact" } },
];

export default function InvestorRoute() {
  return <RoutePage kicker="Phambili · Route" title="Prospective Investor" intro="A guided route tailored to investors." steps={steps} />;
}
