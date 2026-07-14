export interface PortfolioScene {
  id: string;
  number?: string;
  title: string;
  description: string;
  /** Product slugs brought to the foreground for this scene. */
  activeProductIds: string[];
  /** In-use scene illustration (replaces the earlier single-object outline icons on these cards). */
  icon?: string;
  /** Icon's real pixel dimensions, so next/image doesn't warn about aspect-ratio mismatches -- these vary per scene (landscape/square/portrait), unlike the old icon set which were all roughly the same shape. */
  iconWidth?: number;
  iconHeight?: number;
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
 * catalogue's workflow groupings. No opening or closing "full portfolio"
 * card -- every product already appears in its own workflow card, so a card
 * re-listing all nine again just repeated them. EasiAir and EasiCart share
 * one combined card, matching the single "support-equipment" catalogue
 * workflow.
 */
export const PORTFOLIO_SCENES: PortfolioScene[] = [
  {
    id: "lateral-transfer",
    number: "01",
    title: "Lateral transfer",
    description:
      "Air-assisted products supporting surface-to-surface lateral transfer, repositioning and bed boosting.",
    activeProductIds: ["easimove-spu", "easimove-pro"],
    icon: "/icons/workflow/scenes/01-lateral-transfer.png",
    iconWidth: 1672,
    iconHeight: 941,
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
    icon: "/icons/workflow/scenes/02-floor-recovery.png",
    iconWidth: 1672,
    iconHeight: 940,
    workflowUrl: "/workflows/floor-recovery",
    ctaLabel: "Explore floor recovery",
    ctaHref: "/workflows/floor-recovery",
  },
  {
    id: "turning-positioning",
    number: "03",
    title: "Turning and positioning",
    description: "In-bed turning and positioning support for routine repositioning workflows.",
    activeProductIds: ["easiturn"],
    icon: "/icons/workflow/scenes/05-turning-positioning.png",
    iconWidth: 1254,
    iconHeight: 1254,
    workflowUrl: "/workflows/turning-positioning",
    ctaLabel: "Explore turning and positioning",
    ctaHref: "/workflows/turning-positioning",
  },
  {
    id: "hoist-transfer",
    number: "04",
    title: "Hoist transfer",
    description:
      "Sling configurations designed to support defined hoist-transfer, toileting and repositioning workflows.",
    activeProductIds: ["easisling"],
    icon: "/icons/workflow/scenes/04-sling-transfer.png",
    iconWidth: 1448,
    iconHeight: 1086,
    workflowUrl: "/workflows/sling-transfer",
    ctaLabel: "Explore hoist transfer",
    ctaHref: "/workflows/sling-transfer",
  },
  {
    id: "manual-handling-support",
    number: "05",
    title: "Manual handling support",
    description:
      "Rigid transfer aids and low-friction slide sheets supporting everyday repositioning, boosting and transfer assistance.",
    activeProductIds: ["easiglide", "easislide"],
    icon: "/icons/workflow/scenes/03-manual-handling-support.png",
    iconWidth: 1254,
    iconHeight: 1254,
    workflowUrl: "/workflows/manual-handling-support",
    ctaLabel: "Explore manual handling support",
    ctaHref: "/workflows/manual-handling-support",
  },
  {
    id: "support-equipment",
    number: "06",
    title: "Support equipment",
    description:
      "EasiAir™ air supplies and EasiCart™ storage solutions support compatible product operation, accessibility and equipment readiness.",
    activeProductIds: ["easiair", "easicart"],
    icon: "/icons/workflow/scenes/06-support-equipment.png",
    iconWidth: 1122,
    iconHeight: 1402,
    workflowUrl: "/workflows/support-equipment",
    ctaLabel: "Explore workflow support equipment",
    ctaHref: "/workflows/support-equipment",
  },
];

export function getPortfolioScenes(): PortfolioScene[] {
  return PORTFOLIO_SCENES;
}
