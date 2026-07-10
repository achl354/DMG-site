import type { Product } from "@/lib/content/products";

export const easiair: Product = {
  slug: "easiair",
  category: "Support equipment",
  tagline: "Variable speed air supply",
  summary:
    "EasiAir™ is a variable speed air supply designed for use with compatible DirectMed-approved air-assisted patient handling devices, engineered for reliability, simplicity and versatility across modern healthcare environments.",
  features: [
    "High-performance, low-noise motor with overheat protection for repeated clinical use",
    "Stepless variable airflow adjustment for different workflow requirements",
    "Wipe-clean external surfaces and a flexible hose connection for fast set-up",
    "Supports EasiMoveSPU™, EasiMovePRO™ and EasiLift™, plus other DirectMed-approved air-assisted devices",
  ],
  specs: [
    { label: "Product type", value: "Variable speed air supply" },
    { label: "Airflow range", value: "0.8–2.3 m³/min" },
    { label: "Power supply", value: "220–240V AC, 50/60Hz, 1200W" },
    { label: "Net weight", value: "4.4 kg" },
    { label: "Dimensions", value: "Height 31cm, diameter 22cm" },
  ],
};
