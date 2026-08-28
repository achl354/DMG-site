import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/content/products";
import { getAllWorkflows } from "@/lib/content/workflows";
import { getAllResources } from "@/lib/content/resources";
import { RESOURCE_META, RESOURCE_BODIES } from "@/content/resources";
import { SITE_URL } from "@/lib/seo";

/**
 * Next.js's built-in sitemap convention (this file, at app/sitemap.ts) --
 * auto-served at /sitemap.xml, no separate build step. Static routes are
 * listed by hand below; dynamic ones are generated from the same content
 * functions each route's own generateStaticParams already uses, so this
 * can't drift out of sync with what's actually deployed (a new product,
 * workflow or resource shows up here automatically, not via a second
 * manually-maintained list).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/products", "/workflows", "/resources", "/about", "/contact", "/privacy", "/terms"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
    }),
  );

  const productRoutes = getAllProducts().map((product) => ({
    url: `${SITE_URL}/workflows/${product.workflowSlug}/${product.slug}`,
    lastModified: new Date(),
  }));

  const workflowRoutes = getAllWorkflows().map((workflow) => ({
    url: `${SITE_URL}/workflows/${workflow.slug}`,
    lastModified: new Date(),
  }));

  const resourceRoutes = getAllResources(RESOURCE_META, RESOURCE_BODIES).map((resource) => ({
    url: `${SITE_URL}/resources/${resource.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...workflowRoutes, ...productRoutes, ...resourceRoutes];
}
