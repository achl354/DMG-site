import Image from "next/image";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import type { Workflow } from "@/lib/content/workflows";
import { WORKFLOW_ICONS_MOBILE } from "@/lib/content/assets";
import styles from "./WorkflowCard.module.css";

export interface WorkflowCardProps {
  workflow: Workflow;
  featured?: boolean;
  /** Opens the workflow in a modal instead of navigating to its page, when provided. */
  onSelect?: (workflow: Workflow) => void;
}

export function WorkflowCard({ workflow, featured = false, onSelect }: WorkflowCardProps) {
  const icon = WORKFLOW_ICONS_MOBILE[workflow.slug];

  const content = (
    <Card className={[styles.card, featured && styles.featured].filter(Boolean).join(" ")}>
      <span className={featured ? styles.numberFeatured : styles.number}>{workflow.number}</span>
      <div className={styles.top}>
        {icon && (
          <div className={styles.iconBox}>
            <Image src={icon} alt="" width={64} height={64} className={styles.icon} />
          </div>
        )}
        <Badge tone="neutral">
          {workflow.products.length} product{workflow.products.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <h3 className={featured ? styles.titleFeatured : styles.title}>{workflow.title}</h3>
      <p className={styles.summary}>{workflow.summary}</p>
      <p className={styles.solutions}>
        <span className={styles.solutionsLabel}>Workflow solutions:</span> {workflow.solutions}
      </p>
      {/* aria-hidden -- purely a visual "this card is clickable" cue; the
          whole card is already the accessible link/button. */}
      <span className={styles.viewCue} aria-hidden="true">
        Explore workflow
        <span className={styles.viewCueArrow}>→</span>
      </span>
    </Card>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={() => onSelect(workflow)} className={styles.link}>
        {content}
      </button>
    );
  }

  return (
    <Link href={`/workflows/${workflow.slug}`} className={styles.link}>
      {content}
    </Link>
  );
}
