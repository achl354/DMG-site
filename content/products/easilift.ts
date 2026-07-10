import type { Product } from "@/lib/content/products";

export const easilift: Product = {
  slug: "easilift",
  category: "Floor recovery",
  tagline: "Air-assisted floor recovery and patient lift",
  summary:
    "EasiLift™ supports floor recovery workflows by helping teams raise patients from floor level to a seated or transfer-ready height following a fall or floor-level incident, using a stable sequential-inflation platform.",
  sizes: ["32", "39"],
  features: [
    "Sequential multi-chamber inflation progressively raises the patient to a safe seated or transfer height",
    "Single inflation valve for simple, controlled set-up and deflation",
    "Reinforced transfer handles and patient safety straps",
    "Suited across healthcare, aged care and community care falls-management programs",
  ],
  specs: [
    { label: "Product type", value: "Air-assisted floor recovery and patient lift" },
    { label: "Dimensions", value: "81×198×77cm (32\"), 99×198×77cm (39\")" },
    { label: "Safe working load", value: "453 kg" },
    { label: "Air supply compatibility", value: "EasiAir™ variable speed air supply" },
    { label: "Classification", value: "Class I, non-sterile, non-measuring" },
  ],
};
