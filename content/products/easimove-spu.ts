import type { Product } from "@/lib/content/products";

export const easimoveSpu: Product = {
  slug: "easimove-spu",
  category: "Lateral transfer",
  tagline: "Single-patient-use air-assisted lateral transfer mattress",
  summary:
    "Designed for everyday lateral transfer workflows, EasiMoveSPU™ supports patient movement across ward, procedural and imaging settings, with Split-Leg and Mini configurations available for lower-body access and compact transfers.",
  sizes: ["34", "39", "50"],
  features: [
    "Head position indicator and centre alignment line for consistent patient orientation and set-up",
    "Integrated transfer handles and patient safety straps",
    "Low-friction underside for smoother surface-to-surface movement",
    "Available in Split-Leg (theatre and imaging access) and Mini (compact, partial-surface) configurations",
    "GRS-certified recycled material content and compostable PLA packaging",
  ],
  specs: [
    { label: "Product type", value: "Single-patient-use air-assisted lateral transfer mattress" },
    { label: "Dimensions", value: "86×198cm (34\"), 99×198cm (39\"), 127×198cm (50\")" },
    { label: "Safe working load", value: "453 kg" },
    { label: "Air supply compatibility", value: "EasiAir™ variable speed air supply" },
    { label: "Configurations", value: "Standard, Split-Leg, Mini" },
  ],
};
