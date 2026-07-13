import type { Product } from "@/lib/content/products";

export const easicart: Product = {
  slug: "easicart",
  category: "Equipment storage",
  tagline: "Mobile storage cart for equipment readiness",
  summary:
    "EasiCart™ is a mobile storage cart designed to help organise, store and transport patient-handling equipment and accessories. It supports equipment readiness by helping clinical teams keep key equipment accessible, visible and ready for routine use.",
  features: [
    "Helps keep patient-handling equipment organised and ready at point of need",
    "Supports practical movement of equipment between clinical areas where required",
    "Helps support a more structured approach to patient-handling equipment storage",
    "Helps reduce misplaced equipment and supports routine equipment availability",
  ],
  specs: [
    { label: "Product code", value: "MHDM-ECART" },
    { label: "Dimensions", value: "Cart height 92cm · Base width 55cm · Basket 22cm H × 38cm W × 35cm D" },
    { label: "Wall-mount bracket", value: "MHDM-EMAIR-BASKET (EasiAir™ wall-mount bracket, available separately)" },
  ],
};
