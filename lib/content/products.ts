import { PRODUCT_NAMES } from "@/lib/constants";
import { PRODUCT_WORDMARKS } from "@/lib/content/assets";
import { getWorkflowForProduct } from "@/lib/content/workflows";
import { PRODUCTS } from "@/content/products";

export type ProductSize = "32" | "34" | "39" | "50";

export type ProductStatus =
  | "available"
  | "coming-soon"
  | "in-development"
  | "selected-markets"
  | "contact-dmg"
  | "discontinued";

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  available: "Available",
  "coming-soon": "Coming soon",
  "in-development": "In development",
  "selected-markets": "Selected markets",
  "contact-dmg": "Contact DMG",
  discontinued: "Discontinued",
};

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  category: string;
  tagline: string;
  summary: string;
  sizes?: ProductSize[];
  features: string[];
  specs: ProductSpec[];
  /** Omit for generally available products -- only set while a line isn't yet commercially released. */
  status?: ProductStatus;
  /** Direct link to a downloadable product document (IFU, flyer etc.) --
   * when set, the product page shows a quick-access button straight to it. */
  documentUrl?: string;
  /** Button label for documentUrl, e.g. "Download Instructions for Use". Required alongside documentUrl. */
  documentLabel?: string;
}

export interface ProductWithAssets extends Product {
  name: string;
  wordmarkSvg?: string;
  workflowSlug: string;
  /** Never undefined on the hydrated shape -- omitted in content means "available". */
  status: ProductStatus;
}

function withAssets(product: Product): ProductWithAssets {
  return {
    ...product,
    name: PRODUCT_NAMES[product.slug] ?? product.slug,
    wordmarkSvg: PRODUCT_WORDMARKS[product.slug],
    workflowSlug: getWorkflowForProduct(product.slug)?.slug ?? "",
    status: product.status ?? "available",
  };
}

export function getAllProducts(): ProductWithAssets[] {
  return PRODUCTS.map(withAssets);
}

export function getProductBySlug(slug: string): ProductWithAssets | undefined {
  const product = PRODUCTS.find((item) => item.slug === slug);
  return product ? withAssets(product) : undefined;
}

/** Prefers siblings from the same workflow family before padding with the rest of the range. */
export function getRelatedProducts(slug: string, limit = 3): ProductWithAssets[] {
  const all = getAllProducts();
  const current = all.find((product) => product.slug === slug);
  const others = all.filter((product) => product.slug !== slug);

  if (!current) {
    return others.slice(0, limit);
  }

  const sameWorkflow = others.filter((product) => product.workflowSlug === current.workflowSlug);
  const rest = others.filter((product) => product.workflowSlug !== current.workflowSlug);
  return [...sameWorkflow, ...rest].slice(0, limit);
}
