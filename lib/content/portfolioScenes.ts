export interface PortfolioScene {
  id: string;
  number?: string;
  title: string;
  description: string;
  /** Product slugs brought to the foreground for this scene. */
  activeProductIds: string[];
  /** Product slugs kept visible alongside the active ones, at reduced prominence. */
  secondaryProductIds?: string[];
  /** Outline-style workflow illustration, extracted from the approved product catalogue. */
  icon?: string;
  workflowUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

/**
 * The six cards in the homepage product-range overview. Deliberately its
 * own data shape rather than reusing content/workflows -- these scenes group
 * products by what the *card* shows, which doesn't line up 1:1 with the
 * catalogue's workflow groupings (e.g. scene 3 spans EasiTurn, EasiSlide and
 * EasiMove together; EasiGlide gets its own scene despite sharing a
 * catalogue workflow with EasiSlide). No opening or closing "full
 * portfolio" card -- every product already appears in its own workflow
 * card, so a card re-listing all nine again just repeated them. Supporting
 * equipment is the 6th and last card, numbered and styled the same as the
 * other five workflows.
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
    icon: "/icons/workflow/lateral-transfer.png",
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
    icon: "/icons/workflow/floor-recovery.png",
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
    icon: "/icons/workflow/turning-positioning.png",
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
    icon: "/icons/workflow/sling-transfer.png",
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
    icon: "/icons/workflow/manual-handling.png",
    workflowUrl: "/workflows/manual-handling-support",
    ctaLabel: "Explore seated transfer",
    ctaHref: "/workflows/manual-handling-support",
  },
  {
    id: "supporting-equipment",
    number: "06",
    title: "Supporting equipment",
    description:
      "EasiAir™ air supplies and EasiCart™ storage solutions support compatible product operation, accessibility and equipment readiness.",
    activeProductIds: ["easiair", "easicart"],
    icon: "/icons/workflow/support-equipment.png",
    workflowUrl: "/workflows/support-equipment",
    ctaLabel: "Explore supporting equipment",
    ctaHref: "/workflows/support-equipment",
  },
];

export function getPortfolioScenes(): PortfolioScene[] {
  return PORTFOLIO_SCENES;
}
