"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { Modal } from "@/components/ui";
import { WorkflowFamilyContent } from "@/components/workflows";
import { trackEvent } from "@/lib/analytics";
import { getProductBySlug } from "@/lib/content/products";
import { getAllProducts } from "@/lib/content/products";
import { getWorkflowBySlug } from "@/lib/content/workflows";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import { ProductChip } from "@/components/portfolio/ProductChip";
import styles from "./PortfolioCards.module.css";

const VIEW_DWELL_MS = 1000;
const WORKFLOW_PATH_PREFIX = "/workflows/";

export interface PortfolioCardsProps {
  scenes: PortfolioScene[];
  reducedMotion?: boolean;
}

/** The product-range overview: six equal workflow cards, supporting equipment last. */
export function PortfolioCards({ scenes, reducedMotion = false }: PortfolioCardsProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openWorkflow = openSlug ? getWorkflowBySlug(openSlug) : undefined;
  const openProducts = openWorkflow
    ? getAllProducts().filter((product) => openWorkflow.products.includes(product.slug))
    : [];

  return (
    <Container size="xl">
      <div className={styles.list}>
        {scenes.map((scene) => (
          <WorkflowCard key={scene.id} scene={scene} reducedMotion={reducedMotion} onOpenWorkflow={setOpenSlug} />
        ))}
      </div>

      <Modal open={Boolean(openWorkflow)} onClose={() => setOpenSlug(null)} labelledBy="workflow-modal-title">
        {openWorkflow && (
          <WorkflowFamilyContent
            workflow={openWorkflow}
            products={openProducts}
            hideBackLink
            titleTag="h2"
            titleId="workflow-modal-title"
          />
        )}
      </Modal>
    </Container>
  );
}

function CardCta({ scene, onOpenWorkflow }: { scene: PortfolioScene; onOpenWorkflow: (slug: string) => void }) {
  if (!scene.ctaLabel || !scene.ctaHref) return null;

  const workflowSlug = scene.ctaHref.startsWith(WORKFLOW_PATH_PREFIX)
    ? scene.ctaHref.slice(WORKFLOW_PATH_PREFIX.length)
    : null;
  const workflow = workflowSlug ? getWorkflowBySlug(workflowSlug) : undefined;

  if (workflow) {
    return (
      <button
        type="button"
        className={styles.cta}
        onClick={() => {
          trackEvent("workflow_cta_clicked", { scene: scene.id });
          onOpenWorkflow(workflow.slug);
        }}
      >
        {scene.ctaLabel}
        <span className={styles.ctaArrow} aria-hidden="true">
          →
        </span>
      </button>
    );
  }

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

function WorkflowCard({
  scene,
  reducedMotion,
  onOpenWorkflow,
}: {
  scene: PortfolioScene;
  reducedMotion: boolean;
  onOpenWorkflow: (slug: string) => void;
}) {
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

      {scene.icon && (
        <Image
          src={scene.icon}
          alt=""
          width={scene.iconWidth ?? 220}
          height={scene.iconHeight ?? 220}
          className={styles.icon}
        />
      )}

      <div className={styles.productsBlock}>
        <div className={styles.productRow}>
          {scene.activeProductIds.map((slug) => {
            const product = getProductBySlug(slug);
            if (!product) return null;
            return <ProductChip key={slug} name={product.name} />;
          })}
        </div>
      </div>

      <CardCta scene={scene} onOpenWorkflow={onOpenWorkflow} />
    </motion.article>
  );
}
