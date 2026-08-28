import type { Metadata } from "next";

// https://www.easisystems.com.au previously -- corrected to the actual
// production domain (directmedgroup.com, confirmed and configured in
// Vercel/DNS this session). Exported so sitemap.ts/robots.ts can build
// off the exact same base URL rather than a second hardcoded copy.
export const SITE_URL = "https://www.directmedgroup.com";

export function buildMetadata(options: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const { title, description, path } = options;
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "DMG / EasiSystem™",
      locale: "en_AU",
      type: "website",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DirectMed Group",
    url: SITE_URL,
    description:
      "Developer and manufacturer of the EasiSystem™ patient-handling portfolio.",
  };
}
