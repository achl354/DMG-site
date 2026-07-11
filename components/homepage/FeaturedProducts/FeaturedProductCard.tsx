"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, ProductWordmark } from "@/components/ui";
import { PRODUCT_STATUS_LABELS, type ProductWithAssets } from "@/lib/content/products";
import { CTA_LABELS } from "@/lib/constants";
import styles from "./FeaturedProductCard.module.css";

const STATUS_TONE: Record<ProductWithAssets["status"], "success" | "info" | "neutral" | "danger"> = {
  available: "success",
  "coming-soon": "info",
  "in-development": "neutral",
  "selected-markets": "info",
  "contact-dmg": "neutral",
  discontinued: "danger",
};

export interface FeaturedProductCardProps {
  product: ProductWithAssets;
  reverse?: boolean;
  /** Custom scroll-story visual (EasiMoveSPU only) -- falls back to the wordmark tile. */
  visual?: ReactNode;
  onSelect?: () => void;
}

export function FeaturedProductCard({ product, reverse, visual, onSelect }: FeaturedProductCardProps) {
  const href = `/workflows/${product.workflowSlug}/${product.slug}`;

  return (
    <article className={[styles.card, reverse && styles.reverse].filter(Boolean).join(" ")}>
      <div className={styles.visual}>
        {visual ?? (
          <div className={styles.wordmarkTile}>
            <ProductWordmark name={product.name} svgSrc={product.wordmarkSvg} height={56} />
          </div>
        )}
      </div>

      <div className={styles.copy}>
        <div className={styles.labelRow}>
          <span className={styles.label}>{product.category}</span>
          <Badge tone={STATUS_TONE[product.status]}>
            {PRODUCT_STATUS_LABELS[product.status].toUpperCase()}
          </Badge>
        </div>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.descriptor}>{product.tagline}</p>
        {product.homepageSupportingLine && (
          <p className={styles.supportingLine}>{product.homepageSupportingLine}</p>
        )}
        {product.homepageDifferentiator && (
          <p className={styles.differentiator}>{product.homepageDifferentiator}</p>
        )}
        <Link href={href} className={styles.cta} onClick={onSelect}>
          {CTA_LABELS.viewProduct}
        </Link>
      </div>
    </article>
  );
}
