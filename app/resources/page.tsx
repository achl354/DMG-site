import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { ResourceList } from "@/components/marketing";
import { RESOURCE_META } from "@/content/resources";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Resources",
  description:
    "Spec sheets, buying guides, case studies and clinical insights for the EasiSystem™ range.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <Section spacing="lg">
      <Container size="xl">
        <EyebrowHeading
          eyebrow="Resources"
          heading="Spec sheets, guides, case studies and clinical insights"
          className={styles.heading}
        />
        <ResourceList resources={RESOURCE_META} />
      </Container>
    </Section>
  );
}
