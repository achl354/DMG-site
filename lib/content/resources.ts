import type { ComponentType } from "react";

export type ResourceCategory = "Spec sheet" | "Guide" | "Case study";

export interface ResourceMeta {
  slug: string;
  title: string;
  description: string;
  category: ResourceCategory;
  publishedAt: string;
}

export interface Resource extends ResourceMeta {
  Body: ComponentType;
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
