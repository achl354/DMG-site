import Link from "next/link";
import { EyebrowHeading, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { ResourceCard, Reveal } from "@/components/marketing";
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
        {/* Reveal wraps the whole .layout block from outside, rather than
            each child individually -- .grid/.viewAll carry their own
            `order` for mobile reordering (see the CSS), which needs them
            to stay direct children of .layout; wrapping them separately
            would move that order onto an unstyled wrapper instead. */}
        <Reveal>
          <div className={styles.layout}>
            <EyebrowHeading
              eyebrow="Clinical Insight"
              heading="Guidance for safer patient handling"
              className={styles.heading}
            />
            <div className={styles.grid}>
              {insights.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
            <Link href="/resources" className={styles.viewAll}>
              <Button variant="secondary" size="md">
                Browse all resources
              </Button>
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
