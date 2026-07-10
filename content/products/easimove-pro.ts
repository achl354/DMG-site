import type { Product } from "@/lib/content/products";

export const easimovePro: Product = {
  slug: "easimove-pro",
  category: "Lateral transfer",
  tagline: "Reusable air-assisted lateral transfer mattress",
  summary:
    "EasiMovePRO™ supports reusable lateral transfer workflows for facilities looking to reduce reliance on single-use transfer products while maintaining familiar air-assisted patient handling practice.",
  sizes: ["34", "39"],
  features: [
    "Heat-sealed seams help reduce the stitch-line and needle-hole concerns of sewn construction",
    "Wipe-clean, launderable design supports repeated clinical use",
    "Printed head outline and centre alignment line for consistent set-up",
    "Reinforced transfer handles and patient safety straps",
  ],
  specs: [
    { label: "Product type", value: "Reusable air-assisted lateral transfer mattress" },
    { label: "Dimensions", value: "86×198cm (34\"), 99×198cm (39\")" },
    { label: "Construction", value: "RF-welded / heat-sealed, nylon twill" },
    { label: "Safe working load", value: "453 kg" },
    { label: "Air supply compatibility", value: "EasiAir™ variable speed air supply" },
  ],
};
