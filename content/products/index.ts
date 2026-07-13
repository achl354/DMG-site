import type { Product } from "@/lib/content/products";
import { easimoveSpu } from "./easimove-spu";
import { easimovePro } from "./easimove-pro";
import { easiair } from "./easiair";
import { easisling } from "./easisling";
import { easilift } from "./easilift";
import { easicart } from "./easicart";
import { easiglide } from "./easiglide";
import { easislide } from "./easislide";
import { easiturn } from "./easiturn";

/**
 * Sourced from EasiSystem(tm) Portfolio Catalogue FY26/27 (DMG-CAT-ESYS-001).
 * EasiSling and EasiTurn have no catalogue chapter yet -- kept as
 * in-development placeholders until DMG publishes their specifications.
 */
export const PRODUCTS: Product[] = [
  easimoveSpu,
  easimovePro,
  easilift,
  easislide,
  easiglide,
  easisling,
  easiturn,
  easiair,
  easicart,
];
