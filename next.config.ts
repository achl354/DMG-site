import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      {
        source: "/products/easimove-spu",
        destination: "/workflows/lateral-transfer/easimove-spu",
        permanent: true,
      },
      {
        source: "/products/easimove-pro",
        destination: "/workflows/lateral-transfer/easimove-pro",
        permanent: true,
      },
      {
        source: "/products/easilift",
        destination: "/workflows/floor-recovery/easilift",
        permanent: true,
      },
      {
        source: "/products/easislide",
        destination: "/workflows/manual-handling-support/easislide",
        permanent: true,
      },
      {
        source: "/products/easiglide",
        destination: "/workflows/manual-handling-support/easiglide",
        permanent: true,
      },
      {
        source: "/products/easiair",
        destination: "/workflows/air-supply/easiair",
        permanent: true,
      },
      {
        source: "/products/easicart",
        destination: "/workflows/equipment-storage/easicart",
        permanent: true,
      },
      {
        source: "/products/easisling",
        destination: "/workflows/sling-transfer/easisling",
        permanent: true,
      },
      {
        source: "/products/easiturn",
        destination: "/workflows/turning-positioning/easiturn",
        permanent: true,
      },
      {
        source: "/workflows/support-equipment/easiair",
        destination: "/workflows/air-supply/easiair",
        permanent: true,
      },
      {
        source: "/workflows/support-equipment/easicart",
        destination: "/workflows/equipment-storage/easicart",
        permanent: true,
      },
      {
        source: "/workflows/support-equipment",
        destination: "/workflows",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  // String form (not the imported remarkGfm function) -- Turbopack can't
  // pass JS function references to its Rust MDX compiler, only serializable
  // plugin names.
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
