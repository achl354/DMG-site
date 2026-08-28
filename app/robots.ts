import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Next.js's built-in robots convention -- auto-served at /robots.txt.
 * Allows crawling everywhere (nothing on this marketing site needs
 * hiding from search engines) and points at the generated sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
