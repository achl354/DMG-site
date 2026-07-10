import type { Product } from "@/lib/content/products";

export const easislide: Product = {
  slug: "easislide",
  category: "Manual handling support",
  tagline: "Low-friction slide sheet for repositioning and boosting",
  summary:
    "EasiSlide™ is a low-friction slide sheet for routine patient repositioning, turning and boosting tasks where manual handling aids are appropriate — a familiar, accessible solution for everyday patient movement at ward level.",
  features: [
    "Low-friction design reduces the manual handling effort required for routine movement",
    "Simple slide-sheet format supports staff familiarity and routine use",
    "Complements EasiMove™ and EasiGlide™ across the range",
    "Available in single-patient-use and reusable formats",
  ],
  specs: [
    { label: "Product type", value: "Low-friction slide sheet" },
    { label: "Primary workflow", value: "Repositioning, turning and boosting" },
    { label: "Dimensions", value: "200×140cm" },
    { label: "Material", value: "100% polyester (62g/m² single-use, 65g/m² reusable)" },
    { label: "Safe working load", value: "360 kg" },
  ],
};
