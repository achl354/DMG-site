export interface PortfolioScene {
  id: string;
  number?: string;
  title: string;
  description: string;
  /** Product slugs brought to the foreground for this scene. */
  activeProductIds: string[];
  /** Outline-style workflow illustration, extracted from the approved product catalogue. */
  icon?: string;
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
 * catalogue's workflow groupings. No opening or closing "full portfolio"
 * card -- every product already appears in its own workflow card, so a card
 * re-listing all nine again just repeated them. Air supply and equipment
 * storage are split into their own cards (each maps to its own catalogue
 * workflow: air-supply, equipment-storage) rather than one combined
 * "supporting equipment" card.
 */
export const PORTFOLIO_SCENES: PortfolioScene[] = [
  {
    id: "lateral-transfer",
    number: "01",
    title: "Lateral transfer",
    description:
      "Air-assisted products supporting surface-to-surface lateral transfer, repositioning and bed boosting.",
    activeProductIds: ["easimove-spu", "easimove-pro"],
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
    icon: "/icons/workflow/floor-recovery.png",
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
    icon: "/icons/workflow/turning-positioning.png",
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
    icon: "/icons/workflow/sling-transfer.png",
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
    icon: "/icons/workflow/manual-handling.png",
    workflowUrl: "/workflows/manual-handling-support",
    ctaLabel: "Explore manual handling support",
    ctaHref: "/workflows/manual-handling-support",
  },
  {
    id: "air-supply",
    number: "06",
    title: "Air supply",
    description:
      "EasiAir™ provides controlled airflow to compatible DirectMed-approved air-assisted patient handling devices.",
    activeProductIds: ["easiair"],
    icon: "/icons/workflow/air-supply.png",
    workflowUrl: "/workflows/air-supply",
    ctaLabel: "Explore air supply",
    ctaHref: "/workflows/air-supply",
  },
  {
    id: "equipment-storage",
    number: "07",
    title: "Equipment storage",
    description:
      "EasiCart™ supports organised storage and access to patient-handling equipment for routine clinical use.",
    activeProductIds: ["easicart"],
    icon: "/icons/workflow/equipment-storage.png",
    workflowUrl: "/workflows/equipment-storage",
    ctaLabel: "Explore equipment storage",
    ctaHref: "/workflows/equipment-storage",
  },
];

export function getPortfolioScenes(): PortfolioScene[] {
  return PORTFOLIO_SCENES;
}
