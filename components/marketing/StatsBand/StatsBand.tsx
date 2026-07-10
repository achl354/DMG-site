import { Stat } from "@/components/ui";
import { Section, Container } from "@/components/layout";
import styles from "./StatsBand.module.css";

export interface StatsBandProps {
  stats: Array<{ value: string; label: string }>;
}

export function StatsBand({ stats }: StatsBandProps) {
  return (
    <Section surface="brand" spacing="md">
      <Container size="lg">
        <div className={styles.grid}>
          {stats.map((stat) => (
            <Stat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              onBrand
              className={styles.stat}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
