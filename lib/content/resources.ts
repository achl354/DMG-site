import type { ComponentType } from "react";

export type ResourceCategory =
  | "Spec sheet"
  | "Guide"
  | "Case study"
  | "Instructions for use"
  | "Flyer"
  | "Clinical Insight";

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
