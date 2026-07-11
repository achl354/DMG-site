import type { Product } from "@/lib/content/products";

export const easilift: Product = {
  slug: "easilift",
  category: "Floor recovery",
  tagline: "Air-assisted floor recovery and patient lift",
  summary:
    "EasiLift™ supports floor recovery workflows by helping teams raise patients from floor level to a seated or transfer-ready height following a fall or floor-level incident.",
  sizes: ["32", "39"],
  features: [
    "Helps raise patients from floor level to a safe seated or transfer height following a fall",
    "Supports falls-management programs across healthcare, aged care and community care environments",
    "Sequential multi-chamber inflation progressively raises the patient for stable, controlled lifting",
    "Single inflation valve helps reduce set-up steps with controlled inflation and deflation",
    "Reinforced transfer handles and patient safety straps",
  ],
  specs: [
    { label: "Product type", value: "Air-assisted floor recovery and patient lift" },
    { label: "Dimensions", value: "81×198cm (32\"), 99×198cm (39\"); 77cm height" },
    { label: "Product codes", value: "MHDM-EL32 · MHDM-EL39" },
    { label: "Inflation method", value: "Sequential air-assisted" },
    { label: "Safe working load", value: "453 kg" },
    { label: "Air supply compatibility", value: "EasiAir™ / HT-Air® 2300" },
    { label: "Classification", value: "Class I, non-sterile, non-measuring" },
    {
      label: "Trademark notice",
      value: "HoverTech® and HT-Air® are registered trademarks of HoverTech International. Referenced here for compatibility purposes only.",
    },
  ],
};
