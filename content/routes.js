// /content/routes.js
// One source of truth for Phambili audience routes.
// Edit titles/descriptions/CTAs here (fast iteration with your dad).

export const AUDIENCE_SLUGS = ["investor", "partner", "buyer", "supplier"];

export const audienceMeta = {
  investor:  { title: "Prospective Investor",  kicker: "Phambili · Why | Value | How" },
  partner:   { title: "Prospective Partner",   kicker: "Phambili · Why | Value | How" },
  buyer:     { title: "Prospective Product Buyer", kicker: "Phambili · Why | Value | How" },
  supplier:  { title: "Prospective Feedstock Supplier", kicker: "Phambili · Why | Value | How" },
};

// Shared 5-step scaffold — you can override per audience if needed.
const baseSteps = [
  {
    id: "why",
    title: "Why Phambili",
    blurb:
      "Vision, value, and market need. How Biomass Conversion Technology turns waste into clean energy and high‑value products.",
    cta: { label: "Read the Vision", href: "/technology" },
  },
  {
    id: "feedstock",
    title: "Feedstock & Origins",
    blurb:
      "Sourcing, volumes, and logistics. What qualifies as feedstock, and how we secure supply.",
    cta: { label: "See Qualifiers", href: "/applications" },
  },
  {
    id: "risk",
    title: "Risk & Mitigation",
    blurb:
      "Technical, regulatory, and execution risks — and the controls, warranties, and staging that de‑risk rollout.",
    cta: { label: "View Safeguards", href: "/technology" },
  },
  {
    id: "growth",
    title: "Growth & Scaling",
    blurb:
      "Unit economics, replication, and pipeline. How a single plant scales into a regional network.",
    cta: { label: "Scaling Model", href: "/impact" },
  },
  {
    id: "next",
    title: "Next Steps",
    blurb:
      "Roadmap, data room access, and contact. Book a call and get the checklist for your audience.",
    cta: { label: "Book a Call", href: "/contact" },
  },
];

// You can customize per audience by cloning baseSteps and tweaking copy.
export const routesData = {
  investor: baseSteps,
  partner:  baseSteps,
  buyer:    baseSteps,
  supplier: baseSteps,
};
