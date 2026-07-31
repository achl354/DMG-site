"use client";

import { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui";
import type { Workflow } from "@/lib/content/workflows";
import { WORKFLOW_SCENE_ICONS, WORKFLOW_SCENE_ICON_DIMENSIONS } from "@/lib/content/assets";
import { navigateWithViewTransition, isPlainLeftClick } from "@/lib/viewTransition";
import styles from "./WorkflowCard.module.css";

export interface WorkflowCardProps {
  workflow: Workflow;
  featured?: boolean;
  /** Opens the workflow in a modal instead of navigating to its page, when provided. */
  onSelect?: (workflow: Workflow) => void;
}

/**
 * Default (unlisted workflows): 44%, set directly in WorkflowCard.module.css.
 * lateral-transfer/floor-recovery's source scenes are unusually wide
 * (~1.78:1, vs ~1:1 for most others -- see WORKFLOW_SCENE_ICON_DIMENSIONS),
 * so at the same width they rendered noticeably shorter/quieter than the
 * rest. Widened just for these two to bring their visual footprint back
 * in line, same override pattern as ProductCard's ICON_WIDTH_OVERRIDES.
 */
const SCENE_WIDTH_OVERRIDES: Partial<Record<string, string>> = {
  "lateral-transfer": "58%",
  "floor-recovery": "58%",
};

/**
 * Default (unlisted workflows): bottom/right -1rem, set directly in
 * WorkflowCard.module.css. support-equipment's source scene is portrait
 * (taller than wide, unlike most others -- see
 * WORKFLOW_SCENE_ICON_DIMENSIONS), so at the shared offset it sits
 * noticeably more contained/upright than the rest instead of bleeding
 * into the corner the same way. Pushed further for just this one.
 */
const SCENE_OFFSET_OVERRIDES: Partial<Record<string, { bottom: string; right: string }>> = {
  "support-equipment": { bottom: "-2rem", right: "-1.5rem" },
};

export function WorkflowCard({ workflow, featured = false, onSelect }: WorkflowCardProps) {
  const router = useRouter();
  const scene = WORKFLOW_SCENE_ICONS[workflow.slug];
  const [sceneWidth, sceneHeight] = scene ? WORKFLOW_SCENE_ICON_DIMENSIONS[workflow.slug] : [0, 0];
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
      {/* CTA in its own tinted zone -- see .footerPanel's own comment for
          why, and why the scene illustration bleeds here rather than off
          the card as a whole. */}
      <div className={styles.footerPanel}>
        {/* Faint in-use scene, bleeding off this panel's bottom-right
            corner behind the real content -- low-opacity "quiet
            background" language. aria-hidden since it's decorative,
            not information. */}
        {scene && (
          <Image
            src={scene}
            alt=""
            width={sceneWidth}
            height={sceneHeight}
            // See ProductCard.tsx's own comment on its identical sizes
            // prop -- without this, next/image assumes this image
            // displays at its full declared width/height (the source
            // file's native pixel size) and serves a correspondingly
            // large variant, leaving the browser to squeeze that down to
            // the actual ~150-250px CSS-rendered size itself, which can
            // visibly alias thin strokes.
            sizes="250px"
            aria-hidden="true"
            className={styles.sceneIllustration}
            style={
              {
                ...(SCENE_WIDTH_OVERRIDES[workflow.slug] && {
                  "--scene-width": SCENE_WIDTH_OVERRIDES[workflow.slug],
                }),
                ...(SCENE_OFFSET_OVERRIDES[workflow.slug] && {
                  "--scene-bottom": SCENE_OFFSET_OVERRIDES[workflow.slug]!.bottom,
                  "--scene-right": SCENE_OFFSET_OVERRIDES[workflow.slug]!.right,
                }),
              } as CSSProperties
            }
          />
        )}
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
