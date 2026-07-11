"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Container } from "@/components/layout";
import { trackEvent } from "@/lib/analytics";
import { PRODUCT_WORDMARKS } from "@/lib/content/assets";
import { getProductBySlug } from "@/lib/content/products";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import { ProductCardContent } from "@/components/portfolio/ProductCardContent";
import styles from "./PortfolioStackedFallback.module.css";

const EASIMOVE_SPU_PHOTO = "/products/easimove-spu/scroll/01-hero.png";
const VIEW_DWELL_MS = 1000;

export interface PortfolioStackedFallbackProps {
  scenes: PortfolioScene[];
}

/**
 * Mobile, reduced-motion and no-WebGL fallback: normal stacked document
 * scroll, one simplified product visual per scene, no pinning or scrubbed
 * camera movement -- fade/pan/scale only, and only once per scene.
 */
export function PortfolioStackedFallback({ scenes }: PortfolioStackedFallbackProps) {
  return (
    <Container size="xl">
      <div className={styles.list}>
        {scenes.map((scene) => (
          <StackedScene key={scene.id} scene={scene} />
        ))}
      </div>
    </Container>
  );
}

function StackedScene({ scene }: { scene: PortfolioScene }) {
  const visualIds = scene.activeProductIds.slice(0, 3);

  return (
    <motion.div
      className={styles.scene}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4 }}
      onViewportEnter={() => {
        window.setTimeout(() => {
          trackEvent("workflow_scene_viewed", { scene: scene.id });
        }, VIEW_DWELL_MS);
      }}
    >
      {scene.number && <span className={styles.number}>{scene.number}</span>}
      <h3 className={styles.title}>{scene.title}</h3>

      <div className={styles.visualRow}>
        {visualIds.map((slug) => {
          const product = getProductBySlug(slug);
          if (!product) return null;
          return (
            <ProductCardContent
              key={slug}
              name={product.name}
              wordmarkSvg={PRODUCT_WORDMARKS[slug]}
              photoSrc={slug === "easimove-spu" ? EASIMOVE_SPU_PHOTO : undefined}
              status={product.status}
            />
          );
        })}
      </div>

      <p className={styles.description}>{scene.description}</p>

      {scene.activeProductIds.length > 0 && (
        <p className={styles.productNames}>
          {scene.activeProductIds
            .map((slug) => getProductBySlug(slug)?.name)
            .filter(Boolean)
            .join(" · ")}
        </p>
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
  );
}
