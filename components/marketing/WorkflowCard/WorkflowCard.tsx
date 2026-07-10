import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import type { Workflow } from "@/lib/content/workflows";
import styles from "./WorkflowCard.module.css";

export interface WorkflowCardProps {
  workflow: Workflow;
  featured?: boolean;
}

export function WorkflowCard({ workflow, featured = false }: WorkflowCardProps) {
  return (
    <Link href={`/workflows/${workflow.slug}`} className={styles.link}>
      <Card
        className={[styles.card, featured && styles.featured].filter(Boolean).join(" ")}
      >
        <div className={styles.top}>
          <span className={featured ? styles.numberFeatured : styles.number}>
            {workflow.number}
          </span>
          <Badge tone="neutral">
            {workflow.products.length} product{workflow.products.length === 1 ? "" : "s"}
          </Badge>
        </div>
        <p className={styles.familyName}>{workflow.familyName}</p>
        <h3 className={featured ? styles.titleFeatured : styles.title}>{workflow.title}</h3>
        <p className={styles.summary}>{workflow.summary}</p>
      </Card>
    </Link>
  );
}
