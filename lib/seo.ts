import type { Metadata } from "next";

const SITE_URL = "https://www.easisystems.com.au";

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
    name: "JD Healthcare Group",
    url: SITE_URL,
    description:
      "Australian distributor of EasiSystem™ patient-handling equipment, manufactured by DirectMed Group (DMG).",
  };
}
