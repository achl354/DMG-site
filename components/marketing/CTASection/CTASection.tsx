import Link from "next/link";
import { Button } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import { Reveal } from "@/components/marketing/Reveal/Reveal";
import styles from "./CTASection.module.css";

export interface CTASectionProps {
  heading: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
}

export function CTASection({ heading, body, ctaLabel, ctaHref }: CTASectionProps) {
  return (
    <Section surface="cream" spacing="md">
      <Container size="md">
        {/* .inner (flex column + gap) moves onto Reveal's own wrapper, same
            reasoning as ResourcesContact. */}
        <Reveal className={styles.inner}>
          <h2 className={styles.heading}>{heading}</h2>
          {body && <p className={styles.body}>{body}</p>}
          <Link href={ctaHref}>
            <Button variant="primary" size="lg">
              {ctaLabel}
            </Button>
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
