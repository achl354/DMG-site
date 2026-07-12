export interface PortfolioScene {
  id: string;
  number?: string;
  title: string;
  description: string;
  /** Product slugs brought to the foreground for this scene. */
  activeProductIds: string[];
  /** Product slugs kept visible alongside the active ones, at reduced prominence. */
  secondaryProductIds?: string[];
  workflowUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

/**
 * The seven cards in the homepage product-range overview. Deliberately its
 * own data shape rather than reusing content/workflows -- these scenes group
 * products by what the *card* shows, which doesn't line up 1:1 with the
 * catalogue's workflow groupings (e.g. scene 4 spans EasiTurn, EasiSlide and
 * EasiMove together; EasiGlide gets its own scene despite sharing a
 * catalogue workflow with EasiSlide). No standalone opening "full portfolio"
 * card -- the closing "reassembly" card already covers the complete range,
 * so an opening one just repeated it.
 */
export const PORTFOLIO_SCENES: PortfolioScene[] = [
  {
    id: "lateral-transfer",
    number: "01",
    title: "Lateral transfer",
    description:
      "Air-assisted products supporting surface-to-surface lateral transfer, repositioning and bed boosting.",
    activeProductIds: ["easimove-spu", "easimove-pro"],
    secondaryProductIds: ["easiair"],
    workflowUrl: "/workflows/lateral-transfer",
    ctaLabel: "Explore lateral transfer",
    ctaHref: "/workflows/lateral-transfer",
  },
  {
    id: "floor-recovery",
    number: "02",
    title: "Floor recovery",
    description:
      "Air-assisted equipment supporting controlled recovery from floor level and elevation to an appropriate transfer height.",
    activeProductIds: ["easilift"],
    secondaryProductIds: ["easiair"],
    workflowUrl: "/workflows/floor-recovery",
    ctaLabel: "Explore floor recovery",
    ctaHref: "/workflows/floor-recovery",
  },
  {
    id: "repositioning-turning",
    number: "03",
    title: "Repositioning and turning",
    description:
      "Products supporting repositioning, bed boosting, controlled turning, hygiene access and selected positioning workflows.",
    activeProductIds: ["easiturn", "easislide"],
    secondaryProductIds: ["easimove-spu", "easimove-pro"],
    workflowUrl: "/workflows/turning-positioning",
    ctaLabel: "Explore repositioning and turning",
    ctaHref: "/workflows/turning-positioning",
  },
  {
    id: "hoist-transfer",
    number: "04",
    title: "Hoist transfer",
    description:
      "Sling configurations designed to support defined hoist-transfer, toileting and repositioning workflows.",
    activeProductIds: ["easisling"],
    workflowUrl: "/workflows/sling-transfer",
    ctaLabel: "Explore hoist transfer",
    ctaHref: "/workflows/sling-transfer",
  },
  {
    id: "seated-surface-transfer",
    number: "05",
    title: "Seated and surface transfer",
    description: "A rigid transfer aid supporting selected seated and surface-to-surface transfer requirements.",
    activeProductIds: ["easiglide"],
    workflowUrl: "/workflows/manual-handling-support",
    ctaLabel: "Explore seated transfer",
    ctaHref: "/workflows/manual-handling-support",
  },
  {
    id: "supporting-equipment",
    title: "Supporting equipment",
    description:
      "EasiAir™ air supplies and EasiCart™ storage solutions support compatible product operation, accessibility and equipment readiness.",
    activeProductIds: ["easiair", "easicart"],
    workflowUrl: "/workflows/support-equipment",
    ctaLabel: "Explore supporting equipment",
    ctaHref: "/workflows/support-equipment",
  },
  {
    id: "reassembly",
    title: "One coordinated EasiSystem™ portfolio.",
    description: "Explore the complete range or start with the patient-handling workflow you need to support.",
    activeProductIds: [
      "easimove-spu",
      "easimove-pro",
      "easilift",
      "easiair",
      "easisling",
      "easiturn",
      "easislide",
      "easiglide",
      "easicart",
    ],
    ctaLabel: "View all products",
    ctaHref: "/products",
    secondaryCtaLabel: "Explore all workflows",
    secondaryCtaHref: "/workflows",
  },
];

export function getPortfolioScenes(): PortfolioScene[] {
  return PORTFOLIO_SCENES;
}
