"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Container } from "@/components/layout";
import { trackEvent } from "@/lib/analytics";
import { PRODUCT_WORDMARKS } from "@/lib/content/assets";
import { getProductBySlug } from "@/lib/content/products";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import { ProductCardContent } from "@/components/portfolio/ProductCardContent";
import styles from "./PortfolioCards.module.css";

const VIEW_DWELL_MS = 1000;

/** These two cards' supporting-equipment row is dropped on mobile only, to keep the stacked cards shorter. */
const HIDE_SUPPORTING_ON_MOBILE = new Set(["lateral-transfer", "floor-recovery"]);

export interface PortfolioCardsProps {
  scenes: PortfolioScene[];
  reducedMotion?: boolean;
}

/**
 * The product-range overview: one card per scene, in a plain document-flow
 * grid (single column on mobile, two columns on desktop) -- no pinning,
 * scrubbed camera or 3D scene.
 */
export function PortfolioCards({ scenes, reducedMotion = false }: PortfolioCardsProps) {
  return (
    <Container size="xl">
      <div className={styles.list}>
        {scenes.map((scene) => (
          <SceneCard key={scene.id} scene={scene} reducedMotion={reducedMotion} />
        ))}
      </div>
    </Container>
  );
}

function SceneCard({ scene, reducedMotion }: { scene: PortfolioScene; reducedMotion: boolean }) {
  return (
    <motion.div
      className={styles.scene}
      initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      // amount is a fraction of this card's OWN height, not the viewport --
      // these cards can run taller than the viewport on mobile, so a 0.5
      // threshold left the card invisible for up to half its height of
      // scrolling after its top edge appeared, reading as a blank gap.
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0 : 0.4 }}
      onViewportEnter={() => {
        window.setTimeout(() => {
          trackEvent("workflow_scene_viewed", { scene: scene.id });
        }, VIEW_DWELL_MS);
      }}
    >
      {scene.number && <span className={styles.number}>{scene.number}</span>}
      <h3 className={styles.title}>{scene.title}</h3>
      {scene.icon && (
        <Image
          src={scene.icon}
          alt=""
          width={176}
          height={176}
          className={styles.icon}
        />
      )}

      <div className={styles.visualRow}>
        {scene.activeProductIds.map((slug) => {
          const product = getProductBySlug(slug);
          if (!product) return null;
          return (
            <ProductCardContent
              key={slug}
              name={product.name}
              wordmarkSvg={PRODUCT_WORDMARKS[slug]}
              status={product.status}
            />
          );
        })}
      </div>

      {scene.secondaryProductIds && scene.secondaryProductIds.length > 0 && (
        <div
          className={[styles.supportingGroup, HIDE_SUPPORTING_ON_MOBILE.has(scene.id) && styles.supportingGroupHiddenMobile]
            .filter(Boolean)
            .join(" ")}
        >
          <span className={styles.supportingLabel}>Supporting equipment</span>
          <div className={styles.visualRow}>
            {scene.secondaryProductIds.map((slug) => {
              const product = getProductBySlug(slug);
              if (!product) return null;
              return (
                <ProductCardContent
                  key={slug}
                  name={product.name}
                  wordmarkSvg={PRODUCT_WORDMARKS[slug]}
                  status={product.status}
                  compact
                />
              );
            })}
          </div>
        </div>
      )}

      <p className={styles.description}>{scene.description}</p>

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
