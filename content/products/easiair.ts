import type { Product } from "@/lib/content/products";

export const easiair: Product = {
  slug: "easiair",
  category: "Support equipment",
  tagline: "Variable speed air supply",
  summary:
    "EasiAir™ is a variable speed air supply designed for use with compatible DirectMed-approved air-assisted patient handling devices, engineered for reliability, simplicity and versatility across modern healthcare environments.",
  features: [
    "High-performance, low-noise motor with overheat protection supports repeated clinical use",
    "Durable, portable format built for routine handling across multiple care areas",
    "Stepless variable airflow adjustment for different workflow requirements",
    "Wipe-clean external surfaces and a flexible hose connection support fast set-up",
    "Supports core EasiSystem™ workflows — EasiMoveSPU™, EasiMovePRO™ and EasiLift™",
    "Also supports other DirectMed-approved air-assisted devices where approved",
  ],
  specs: [
    { label: "Product code", value: "MHDM-EMAIR" },
    { label: "Classification", value: "Class I, non-sterile, non-measuring" },
    { label: "Compatible devices", value: "DirectMed-approved air-assisted devices" },
    { label: "Airflow range", value: "0.8–2.3 m³/min" },
    { label: "Speed control", value: "Stepless variable" },
    { label: "Noise level", value: "≤83 dB(A)" },
    { label: "Power supply", value: "220–240V AC, 50/60Hz, 1200W, 5.5A" },
    { label: "Hose length", value: "1.5 m" },
    { label: "Power cord length", value: "3 m" },
    { label: "Net weight", value: "4.4 kg (approx.)" },
  ],
  documentUrl: "/resources/documents/easiair-ifu.pdf",
  documentLabel: "Download Instructions for Use",
};
