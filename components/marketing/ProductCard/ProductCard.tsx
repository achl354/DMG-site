"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Badge, ProductWordmark } from "@/components/ui";
import { type ProductWithAssets } from "@/lib/content/products";
import { navigateWithViewTransition, isPlainLeftClick } from "@/lib/viewTransition";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: ProductWithAssets }) {
  const router = useRouter();
  const href = `/workflows/${product.workflowSlug}/${product.slug}`;

  return (
    <Link
      href={href}
      className={styles.link}
      onClick={(event) => {
        // Let the browser handle its own affordances (open in new tab/window,
        // etc.) for anything other than a plain left click -- only a plain
        // click should be hijacked into the manual view-transition navigation.
        if (!isPlainLeftClick(event)) return;
        event.preventDefault();
        navigateWithViewTransition(router, href);
      }}
    >
      <Card className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badgeRow}>
            <Badge tone="brand">{product.category}</Badge>
          </div>
          <ProductWordmark
            name={product.name}
            svgSrc={product.wordmarkSvg}
            height={24}
            className={styles.wordmark}
          />
          <p className={styles.tagline}>{product.tagline}</p>
        </div>
        {/* Solutions-equivalent footer panel, matching WorkflowCard's
            pattern -- the CTA in its own tinted zone. The product's own
            icon that used to bleed off its bottom-right corner is
            removed for now (experiment, comparing against /workflows'
            cards with theirs also removed). */}
        <div className={styles.footerPanel}>
          {/* aria-hidden -- purely a visual "this card is clickable" cue; the
              whole card is already the accessible link. */}
          <span className={styles.viewCue} aria-hidden="true">
            View product
            <span className={styles.viewCueArrow}>→</span>
          </span>
        </div>
      </Card>
    </Link>
  );
}
