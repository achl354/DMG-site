import { EyebrowHeading } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import styles from "./WhyEasiSystem.module.css";

const PILLARS = [
  {
    title: "Workflow-led",
    body: "Organised around how patients actually move, not a flat product catalogue.",
    icon: (
      <path d="M4 12h16M4 12l5-5M4 12l5 5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Coordinated",
    body: "Products are designed to work together across related patient-handling workflows.",
    icon: (
      <>
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="17" cy="7" r="2.5" />
        <circle cx="12" cy="17" r="2.5" />
        <path d="M9 8.5l2 6.5M15 8.5l-2 6.5M9.3 6h5.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Practical options",
    body: "Single-patient-use and reusable configurations to suit different care settings.",
    icon: (
      <path
        d="M4 7h16M4 12h10M4 17h16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Supported by resources",
    body: "Instructions for use, specifications and training resources for every product.",
    icon: (
      <path
        d="M6 4h9l3 3v13H6V4z M15 4v3h3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export function WhyEasiSystem() {
  return (
    <Section id="why-easisystem" spacing="md" surface="cream">
      <Container size="lg">
        <EyebrowHeading eyebrow="Why EasiSystem™" heading="One coordinated portfolio" className={styles.heading} />
        <div className={styles.grid}>
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className={styles.pillar}>
              <svg
                className={styles.icon}
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                {pillar.icon}
              </svg>
              <h3 className={styles.title}>{pillar.title}</h3>
              <p className={styles.body}>{pillar.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
