import type { ComponentType } from "react";

export type ResourceCategory =
  | "Spec sheet"
  | "Guide"
  | "Case study"
  | "Instructions for use"
  | "Flyer"
  | "Clinical Insight";

/** Top-level grouping shown as the /resources page's primary filters --
 * several categories collapse into "Product documents" rather than each
 * being its own top-level filter. */
export type ResourceGroup =
  | "product-documents"
  | "guides"
  | "case-studies"
  | "clinical-insights";

const CATEGORY_TO_GROUP: Record<ResourceCategory, ResourceGroup> = {
  "Spec sheet": "product-documents",
  "Instructions for use": "product-documents",
  Flyer: "product-documents",
  Guide: "guides",
  "Case study": "case-studies",
  "Clinical Insight": "clinical-insights",
};

export function getResourceGroup(category: ResourceCategory): ResourceGroup {
  return CATEGORY_TO_GROUP[category];
}

export const RESOURCE_GROUP_LABELS: Record<ResourceGroup, string> = {
  "product-documents": "Product documents",
  guides: "Guides",
  "case-studies": "Case studies",
  "clinical-insights": "Clinical insights",
};

export interface ResourceMeta {
  slug: string;
  title: string;
  description: string;
  category: ResourceCategory;
  publishedAt: string;
  /** Direct link to a real downloadable file (PDF etc.) -- when set, the
   * detail page shows a download button for it instead of requiring an
   * MDX Body. Written resources (spec sheets, guides) omit this and rely
   * on Body instead; the two aren't mutually exclusive if a resource ever
   * needs both. */
  fileUrl?: string;
  /** Topic tags shown as chips on the detail page. */
  tags?: string[];
  /** Citations shown as a short "Sources" line at the end of the article. */
  sources?: string[];
  /** Real file metadata for an actual downloadable PDF (fileUrl set) --
   * never fabricated for a resource without one. easilift-spec-sheet, for
   * example, carries a "Spec sheet" category but is an MDX article with
   * no real file, so it omits these rather than showing invented numbers. */
  fileType?: "PDF";
  pageCount?: number;
  fileSize?: string;
  /** Product slug (matching PRODUCT_ICONS in lib/content/assets.ts) shown
   * as a small outline illustration on this resource's card, where the
   * resource is clearly about one specific product. */
  product?: string;
  /** Surfaced in the page's featured-resources section. */
  featured?: boolean;
}

export interface Resource extends ResourceMeta {
  /** Omitted for file-only resources (see fileUrl) that have no article content. */
  Body?: ComponentType;
}

export function getAllResources(
  metaList: ResourceMeta[],
  bodies: Record<string, ComponentType>,
): Resource[] {
  return metaList.map((meta) => ({ ...meta, Body: bodies[meta.slug] }));
}

export function getResourceBySlug(
  slug: string,
  metaList: ResourceMeta[],
  bodies: Record<string, ComponentType>,
): Resource | undefined {
  const meta = metaList.find((item) => item.slug === slug);
  return meta ? { ...meta, Body: bodies[meta.slug] } : undefined;
}

/** Most recently published entries in a category, newest first. */
export function getLatestByCategory(
  metaList: ResourceMeta[],
  category: ResourceCategory,
  limit: number,
): ResourceMeta[] {
  return metaList
    .filter((item) => item.category === category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}
