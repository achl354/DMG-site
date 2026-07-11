import type { Product } from "@/lib/content/products";

export const easimoveSpu: Product = {
  slug: "easimove-spu",
  category: "Lateral transfer",
  tagline: "Single-patient-use air-assisted lateral transfer mattress",
  summary:
    "Designed for everyday lateral transfer workflows, the EasiMove™ SPU range supports patient movement across ward, procedural and imaging settings, with a Split-Leg option for lower-body access.",
  homepageSupportingLine:
    "Supports patient-dedicated lateral-transfer, repositioning and bed-boosting workflows.",
  homepageDifferentiator:
    "Single-patient-use, air-assisted, available in Standard, Split-Leg and Mini configurations.",
  sizes: ["34", "39", "50"],
  features: [
    "Supports smoother surface-to-surface patient movement, with transfer performance comparable to leading SPU systems in internal comparative testing",
    "Maintains full working width when inflated for consistent transfer coverage",
    "Head position indicator and centre alignment line support patient orientation, centring and set-up",
    "Split-Leg (theatre and imaging access) and Mini (compact, partial-surface) configurations support workflow-specific lower-body and compact transfer needs",
    "GRS-certified recycled material content supports responsible sourcing objectives",
    "Compostable PLA packaging supports facility waste-reduction initiatives where accepted by local processes",
  ],
  specs: [
    { label: "Product type", value: "Single-patient-use air-assisted lateral transfer mattress" },
    {
      label: "Dimensions",
      value: "86×198cm (34\"), 99×198cm (39\"), 127×198cm (50\"); 86×114cm (34\" Mini), 99×114cm (39\" Mini)",
    },
    {
      label: "Product codes",
      value: "MHDM-EM34SPU · MHDM-EM39SPU · MHDM-EM50SPU · MHDM-EM34SPU-SL (Split-Leg) · MHDM-EM34SPU-MI / MHDM-EM39SPU-MI (Mini)",
    },
    { label: "Safe working load", value: "453 kg" },
    { label: "Air supply compatibility", value: "EasiAir™ / HT-Air® 2300" },
    { label: "Configurations", value: "Standard, Split-Leg, Mini" },
  ],
};
