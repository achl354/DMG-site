import { Section, Container } from "@/components/layout";
import { evidenceFacts, pickRandomFactIndex } from "@/lib/content/evidenceFacts";
import { EvidenceFactCard } from "./EvidenceFactCard";
import styles from "./DidYouKnowSection.module.css";

/**
 * The whole app already opts out of static rendering (root layout reads
 * cookies() for the desktop-view toggle), so every request already
 * server-renders this page fresh -- picking the fact here means the very
 * first HTML response has its final value baked in, with no client-side
 * reselection and therefore no hydration mismatch to guard against.
 */
export function DidYouKnowSection() {
  const initialIndex = pickRandomFactIndex(evidenceFacts.length);

  return (
    <Section spacing="md" surface="cream" className={styles.section}>
      <Container size="lg">
        <EvidenceFactCard facts={evidenceFacts} initialIndex={initialIndex} />
      </Container>
    </Section>
  );
}
