import {
  HeroSection,
  WorkflowStory,
  SupportingEquipment,
  FeaturedProducts,
  WhyEasiSystem,
  ResourcesContact,
} from "@/components/homepage";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { getWorkflowStoryScenes, getWorkflowBySlug } from "@/lib/content/workflows";
import { getAllProducts, getProductBySlug } from "@/lib/content/products";
import { FEATURED_PRODUCT_SLUGS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "EasiSystem™ Patient Handling Products | DirectMed Group",
  description:
    "Explore DirectMed Group's EasiSystem™ portfolio supporting lateral transfer, floor recovery, repositioning, turning, sling transfer and related patient-handling workflows.",
  path: "/",
});

export default function Home() {
  const workflowScenes = getWorkflowStoryScenes();

  const supportEquipmentSlugs = getWorkflowBySlug("support-equipment")?.products ?? [];
  const supportEquipmentProducts = supportEquipmentSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const allProducts = getAllProducts();
  const featuredProducts = FEATURED_PRODUCT_SLUGS.map((slug) =>
    allProducts.find((product) => product.slug === slug),
  ).filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <ReducedMotionProvider>
      <HeroSection />
      <WorkflowStory scenes={workflowScenes} />
      <SupportingEquipment products={supportEquipmentProducts} />
      <FeaturedProducts products={featuredProducts} />
      <WhyEasiSystem />
      <ResourcesContact />
    </ReducedMotionProvider>
  );
}
