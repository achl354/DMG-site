"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { trackEvent } from "@/lib/analytics";
import { getProductBySlug } from "@/lib/content/products";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import { ProductChip } from "@/components/portfolio/ProductChip";
import styles from "./PortfolioCards.module.css";

const VIEW_DWELL_MS = 1000;

export interface PortfolioCardsProps {
  scenes: PortfolioScene[];
  reducedMotion?: boolean;
}

/** The product-range overview: six equal workflow cards, supporting equipment last. */
export function PortfolioCards({ scenes, reducedMotion = false }: PortfolioCardsProps) {
  return (
    <Container size="xl">
      <div className={styles.list}>
        {scenes.map((scene) => (
          <WorkflowCard key={scene.id} scene={scene} reducedMotion={reducedMotion} />
        ))}
      </div>
    </Container>
  );
}

function CardCta({ scene }: { scene: PortfolioScene }) {
  if (!scene.ctaLabel || !scene.ctaHref) return null;
  return (
    <Link
      href={scene.ctaHref}
      className={styles.cta}
      onClick={() => trackEvent("workflow_cta_clicked", { scene: scene.id })}
    >
      {scene.ctaLabel}
      <span className={styles.ctaArrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}

function WorkflowCard({ scene, reducedMotion }: { scene: PortfolioScene; reducedMotion: boolean }) {
  return (
    <motion.article
      className={styles.card}
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
      <p className={styles.description}>{scene.description}</p>

      {scene.icon && <Image src={scene.icon} alt="" width={220} height={220} className={styles.icon} />}

      <div className={styles.productsBlock}>
        <span className={styles.productsLabel}>Primary products</span>
        <div className={styles.productRow}>
          {scene.activeProductIds.map((slug) => {
            const product = getProductBySlug(slug);
            if (!product) return null;
            return <ProductChip key={slug} name={product.name} status={product.status} tone="primary" />;
          })}
        </div>
      </div>

      {scene.secondaryProductIds && scene.secondaryProductIds.length > 0 && (
        <div className={styles.productsBlock}>
          <span className={styles.productsLabel}>Supporting equipment</span>
          <div className={styles.productRow}>
            {scene.secondaryProductIds.map((slug) => {
              const product = getProductBySlug(slug);
              if (!product) return null;
              return <ProductChip key={slug} name={product.name} status={product.status} tone="supporting" />;
            })}
          </div>
        </div>
      )}

      <CardCta scene={scene} />
    </motion.article>
  );
}
