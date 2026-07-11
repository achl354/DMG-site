"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui";
import { EASE_OUT } from "@/lib/motion";
import { trackEvent } from "@/lib/analytics";
import { PRODUCT_NAMES } from "@/lib/constants";
import { getProductBySlug, PRODUCT_STATUS_LABELS } from "@/lib/content/products";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import styles from "./PortfolioTextPanel.module.css";

export interface PortfolioTextPanelProps {
  scene: PortfolioScene;
}

/** Left content panel -- crossfades per scene, capped at three product links per the workflow copy rules. */
export function PortfolioTextPanel({ scene }: PortfolioTextPanelProps) {
  const linkedProductIds = [...scene.activeProductIds, ...(scene.secondaryProductIds ?? [])].slice(0, 3);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.id}
        className={styles.panel}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } }}
        exit={{ opacity: 0, y: -12, transition: { duration: 0.18, ease: EASE_OUT } }}
      >
        {scene.number && <span className={styles.number}>{scene.number}</span>}
        <h3 className={styles.title}>{scene.title}</h3>
        <p className={styles.description}>{scene.description}</p>

        {linkedProductIds.length > 0 && (
          <div className={styles.productLinks}>
            {linkedProductIds.map((slug) => {
              const product = getProductBySlug(slug);
              if (!product) return null;
              return (
                <Link
                  key={slug}
                  href={`/workflows/${product.workflowSlug}/${slug}`}
                  className={styles.productLink}
                  onClick={() => trackEvent("product_clicked", { product: slug, scene: scene.id })}
                >
                  {PRODUCT_NAMES[slug] ?? product.name}
                  {product.status !== "available" && (
                    <span className={styles.productStatus}>{PRODUCT_STATUS_LABELS[product.status]}</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {scene.ctaLabel && scene.ctaHref && (
          <div className={styles.ctaRow}>
            <Link
              href={scene.ctaHref}
              onClick={() =>
                trackEvent(
                  scene.ctaHref === "/products" ? "view_all_products_clicked" : "workflow_cta_clicked",
                  { scene: scene.id },
                )
              }
            >
              <Button variant="primary" size="md">
                {scene.ctaLabel}
              </Button>
            </Link>
            {scene.secondaryCtaLabel && scene.secondaryCtaHref && (
              <Link
                href={scene.secondaryCtaHref}
                onClick={() => trackEvent("explore_all_workflows_clicked", { scene: scene.id })}
              >
                <Button variant="secondary" size="md">
                  {scene.secondaryCtaLabel}
                </Button>
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
