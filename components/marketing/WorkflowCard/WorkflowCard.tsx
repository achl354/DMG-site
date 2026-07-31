"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import type { Workflow } from "@/lib/content/workflows";
import { navigateWithViewTransition, isPlainLeftClick } from "@/lib/viewTransition";
import styles from "./WorkflowCard.module.css";

export interface WorkflowCardProps {
  workflow: Workflow;
  featured?: boolean;
  /** Opens the workflow in a modal instead of navigating to its page, when provided. */
  onSelect?: (workflow: Workflow) => void;
}

export function WorkflowCard({ workflow, featured = false, onSelect }: WorkflowCardProps) {
  const router = useRouter();
  const href = `/workflows/${workflow.slug}`;

  const content = (
    <Card className={[styles.card, featured && styles.featured].filter(Boolean).join(" ")}>
      <div className={styles.header}>
        <span className={featured ? styles.numberFeatured : styles.eyebrowNumber}>
          {workflow.number}
        </span>
        <h3 className={featured ? styles.titleFeatured : styles.title}>{workflow.title}</h3>
        <p className={styles.summary}>{workflow.summary}</p>
      </div>
      {/* Solutions row + CTA, in their own tinted zone -- see
          .footerPanel's own comment for why. */}
      <div className={styles.footerPanel}>
        <p className={styles.solutions}>
          <span className={styles.solutionsLabel}>Workflow solutions:</span> {workflow.solutions}
        </p>
        {/* aria-hidden -- purely a visual "this card is clickable" cue; the
            whole card is already the accessible link/button. */}
        <span className={styles.viewCue} aria-hidden="true">
          Explore workflow
          <span className={styles.viewCueArrow}>→</span>
        </span>
      </div>
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
    <Link
      href={href}
      className={styles.link}
      onClick={(event) => {
        // Same left-click-only guard as ProductCard -- anything else (open
        // in a new tab, etc.) should get the browser's own unmodified
        // behavior, not the manual view-transition navigation below.
        if (!isPlainLeftClick(event)) return;
        event.preventDefault();
        navigateWithViewTransition(router, href);
      }}
    >
      {content}
    </Link>
  );
}
