import Link from "next/link";
import { Tagline, Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import {
  HeroSlot,
  WorkflowJourney,
  WorkflowCard,
  StatsBand,
  CTASection,
  Reveal,
} from "@/components/marketing";
import { getAllWorkflows } from "@/lib/content/workflows";
import { buildMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "EasiSystem™ Patient Handling Products | DirectMed Group",
  description:
    "Explore DirectMed Group's EasiSystem™ portfolio of patient transfer, floor recovery, repositioning, sling, turning and supporting equipment solutions.",
  path: "/",
});

const BENTO_SPANS = [
  styles.bentoWide,
  styles.bentoHalf,
  styles.bentoHalf,
  styles.bentoHalf,
  styles.bentoQuarter,
  styles.bentoQuarter,
];

export default function Home() {
  const workflows = getAllWorkflows();

  return (
    <>
      <Section spacing="lg" surface="page" className={styles.heroSection}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <Container size="xl">
          <div className={styles.hero}>
            <Reveal>
              <p className={styles.eyebrow}>EasiSystem™ patient handling</p>
            </Reveal>
            <Reveal delay={0.08}>
              <Tagline as="h1" className={styles.tagline} />
            </Reveal>
            <Reveal delay={0.16}>
              <p className={styles.subhead}>
                A coordinated patient-handling portfolio supporting transfer, floor
                recovery, repositioning, turning and lifting workflows.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className={styles.body}>
                Developed by DirectMed Group, EasiSystem™ brings together
                air-assisted devices, slings, transfer aids, positioning products
                and supporting equipment within one clearly structured portfolio.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className={styles.ctaRow}>
                <Link href="/products">
                  <Button size="lg">Explore products</Button>
                </Link>
                <Link href="/workflows">
                  <Button variant="secondary" size="lg">
                    Explore workflows
                  </Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <p className={styles.trust}>Designed and manufactured by DirectMed Group.</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" surface="sunken">
        <HeroSlot />
      </Section>

      <Section spacing="lg" surface="page">
        <WorkflowJourney workflows={workflows} />
      </Section>

      <Section spacing="lg" surface="page">
        <Container size="xl">
          <Reveal>
            <div className={styles.gridHeader}>
              <h2 className={styles.gridHeading}>One portfolio. Multiple patient-handling workflows.</h2>
              <Link href="/workflows" className={styles.gridLink}>
                View all workflows
              </Link>
            </div>
          </Reveal>
          <div className={styles.bentoGrid}>
            {workflows.map((workflow, index) => (
              <Reveal
                key={workflow.slug}
                delay={index * 0.06}
                className={BENTO_SPANS[index]}
              >
                <WorkflowCard workflow={workflow} featured={index === 0} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Reveal>
        <StatsBand
          stats={[
            { value: "6", label: "Patient-handling workflow categories" },
            { value: "9", label: "Product lines across the EasiSystem™ range" },
            { value: "1", label: "Coordinated patient-handling portfolio" },
          ]}
        />
      </Reveal>

      <Reveal>
        <CTASection
          heading="Discuss your patient-handling requirements"
          body="Tell us about the patient cohort, care environment and workflow you need to support. The DirectMed Group team can help identify relevant product information and suitable next steps."
          ctaLabel="Contact DMG"
          ctaHref="/contact"
        />
      </Reveal>
    </>
  );
}
