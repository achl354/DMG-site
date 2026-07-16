import Link from "next/link";
import { EyebrowHeading, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { ResourceCard } from "@/components/marketing";
import { getLatestByCategory } from "@/lib/content/resources";
import { RESOURCE_META } from "@/content/resources";
import styles from "./LatestInsightsSection.module.css";

const INSIGHT_COUNT = 3;

export function LatestInsightsSection() {
  const insights = getLatestByCategory(RESOURCE_META, "Clinical Insight", INSIGHT_COUNT);

  if (insights.length === 0) {
    return null;
  }

  return (
    <Section spacing="md">
      <Container size="lg">
        <div className={styles.header}>
          <EyebrowHeading eyebrow="Clinical Insight" heading="Latest from our clinical resources" />
          <Link href="/resources" className={styles.viewAll}>
            <Button variant="secondary" size="md">
              Browse all resources
            </Button>
          </Link>
        </div>
        <div className={styles.grid}>
          {insights.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
