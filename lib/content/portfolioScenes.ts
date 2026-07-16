export interface PortfolioScene {
  id: string;
  number?: string;
  title: string;
  description: string;
  /** Product slugs brought to the foreground for this scene. */
  activeProductIds: string[];
  /** Short workflow/task keywords this scene's products support, shown as a "Supports:" line on the card. */
  supports: string[];
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
    title: "Air-Assisted Lateral Transfer",
    description:
      "Move patients between beds, trolleys, imaging tables and procedural surfaces using air-assisted transfer technology designed to reduce friction and physical effort.",
    activeProductIds: ["easimove-spu", "easimove-pro"],
    supports: ["Lateral transfer", "Repositioning", "Bed boosting", "Lower-limb access"],
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
    title: "Air-Assisted Floor Recovery",
    description:
      "Support the controlled elevation of a patient from the floor or a low seated position using sequential air-assisted inflation.",
    activeProductIds: ["easilift"],
    supports: ["Floor recovery", "Seated recovery", "Patient elevation"],
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
    title: "In-Bed Turning and Positioning",
    description:
      "Support controlled turning and patient positioning for hygiene, wound access, pressure-care activities and routine bedside care.",
    activeProductIds: ["easiturn"],
    supports: ["Controlled turning", "Hygiene access", "Wound access"],
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
    title: "Sling-Based Patient Transfer",
    description:
      "Support hoist-assisted movement using reusable and single-patient-use sling options for a range of transfer and care requirements.",
    activeProductIds: ["easisling"],
    supports: ["Hoist transfer", "Toileting transfer", "Sit-to-stand", "Repositioning"],
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
    title: "Manual Handling Support",
    description:
      "Support routine patient movement within or between surfaces using low-friction slide sheets and rigid transfer aids selected for the specific task.",
    activeProductIds: ["easislide", "easiglide"],
    supports: ["Repositioning", "Bed boosting", "Surface transfer"],
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
    title: "Air Supply and Equipment Readiness",
    description:
      "Keep air-assisted patient-handling equipment organised, accessible and ready for use with compatible air supplies and dedicated storage solutions.",
    activeProductIds: ["easiair", "easicart"],
    supports: ["Equipment readiness", "Air supply access", "Mobile storage"],
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
