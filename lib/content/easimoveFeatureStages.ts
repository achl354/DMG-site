export interface FeatureCallout {
  id: string;
  label: string;
  /** Percentage position (0-100) within the stage's own image frame. */
  x: number;
  y: number;
}

export interface FeatureStage {
  id: string;
  heading: string;
  copy: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  callouts?: FeatureCallout[];
}

/**
 * Temporary/experimental: EasiMoveSPU™ desktop scroll-reveal (stages 1-4
 * only -- see AGENTS notes in EasiMoveRevealSection.tsx). Every image is a
 * plain pixel crop of the single already-approved product photo
 * (rotation/08_hero_full_product_photo.webp), not a separate photograph or
 * generated asset -- see public/images/easimove-reveal/.
 */
export const EASIMOVE_FEATURE_STAGES: FeatureStage[] = [
  {
    id: "full-product",
    heading: "Air-assisted lateral transfer",
    copy: "EasiMove SPU™ supports lateral transfer, repositioning and bed boosting across compatible clinical surfaces.",
    image: "/images/easimove-reveal/easimove-spu-full.webp",
    imageWidth: 1600,
    imageHeight: 1600,
    alt: "EasiMoveSPU™ air-assisted lateral transfer mattress, full product view",
  },
  {
    id: "alignment",
    heading: "Clear alignment guidance",
    copy: "The head outline and centre line provide clear visual references for product orientation and patient positioning.",
    image: "/images/easimove-reveal/easimove-spu-alignment.webp",
    imageWidth: 900,
    imageHeight: 640,
    alt: "Close-up of EasiMoveSPU™'s printed head outline and centre alignment line",
    callouts: [
      { id: "head-outline", label: "Head outline", x: 36, y: 16 },
      { id: "centre-line", label: "Centre line", x: 58, y: 55 },
    ],
  },
  {
    id: "handles",
    heading: "Defined handling points",
    copy: "High-visibility handles help staff identify the intended handling locations during setup and patient movement.",
    image: "/images/easimove-reveal/easimove-spu-handles.webp",
    imageWidth: 900,
    imageHeight: 700,
    alt: "Close-up of one of EasiMoveSPU™'s high-visibility red handling loops",
    callouts: [{ id: "handle", label: "High-visibility handle", x: 15, y: 45 }],
  },
  {
    id: "label",
    heading: "Information where it is needed",
    copy: "Foot-end identification and product labelling provide clear access to essential product information.",
    image: "/images/easimove-reveal/easimove-spu-label.webp",
    imageWidth: 850,
    imageHeight: 350,
    alt: "EasiMoveSPU™ foot-end product label showing size and product identification",
    callouts: [{ id: "label", label: "Foot-end label", x: 33, y: 40 }],
  },
];
