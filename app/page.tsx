import { HeroSection, PortfolioScrollSection, WhyEasiSystem, ResourcesContact } from "@/components/homepage";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { getPortfolioScenes } from "@/lib/content/portfolioScenes";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "EasiSystem™ Patient Handling Products | DirectMed Group",
  description:
    "Explore DirectMed Group's EasiSystem™ portfolio supporting lateral transfer, floor recovery, repositioning, turning, sling transfer and related patient-handling workflows.",
  path: "/",
});

export default function Home() {
  const scenes = getPortfolioScenes();

  return (
    <ReducedMotionProvider>
      <HeroSection />
      <PortfolioScrollSection scenes={scenes} />
      <WhyEasiSystem />
      <ResourcesContact />
    </ReducedMotionProvider>
  );
}
