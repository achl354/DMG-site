export type PortfolioMotionType =
  | "portfolio"
  | "horizontal"
  | "vertical"
  | "diagonal"
  | "curve"
  | "docking";

export interface PortfolioScene {
  id: string;
  number?: string;
  title: string;
  description: string;
  /** Product slugs brought to the foreground for this scene. */
  activeProductIds: string[];
  /** Product slugs kept visible alongside the active ones, at reduced prominence. */
  secondaryProductIds?: string[];
  motionType: PortfolioMotionType;
  workflowUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

/**
 * The eight states of the homepage product-range scroll. Deliberately its
 * own data shape rather than reusing content/workflows -- these scenes group
 * products by what the *scene* shows, which doesn't line up 1:1 with the
 * catalogue's workflow groupings (e.g. scene 4 spans EasiTurn, EasiSlide and
 * EasiMove together; EasiGlide gets its own scene despite sharing a
 * catalogue workflow with EasiSlide).
 */
export const PORTFOLIO_SCENES: PortfolioScene[] = [
  {
    id: "portfolio",
    title: "The EasiSystem™ portfolio",
    description:
      "A coordinated range supporting multiple patient-handling tasks across healthcare and supported-care environments.",
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
    motionType: "portfolio",
    ctaLabel: "View all products",
    ctaHref: "/products",
  },
  {
    id: "lateral-transfer",
    number: "01",
    title: "Lateral transfer",
    description:
      "Air-assisted products supporting surface-to-surface lateral transfer, repositioning and bed boosting.",
    activeProductIds: ["easimove-spu", "easimove-pro"],
    secondaryProductIds: ["easiair"],
    motionType: "horizontal",
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
    motionType: "vertical",
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
    motionType: "diagonal",
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
    motionType: "curve",
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
    motionType: "horizontal",
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
    motionType: "docking",
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
    motionType: "portfolio",
    ctaLabel: "View all products",
    ctaHref: "/products",
    secondaryCtaLabel: "Explore all workflows",
    secondaryCtaHref: "/workflows",
  },
];

export function getPortfolioScenes(): PortfolioScene[] {
  return PORTFOLIO_SCENES;
}
