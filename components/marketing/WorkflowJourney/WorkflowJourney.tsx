"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ProductWordmark } from "@/components/ui";
import { Container } from "@/components/layout/Container/Container";
import { useScrollProgress } from "@/components/scroller/useScrollProgress";
import { usePrefersReducedMotion } from "@/components/scroller/usePrefersReducedMotion";
import { PRODUCT_NAMES } from "@/lib/constants";
import { PRODUCT_WORDMARKS } from "@/lib/content/assets";
import type { Workflow } from "@/lib/content/workflows";
import { WORKFLOW_MOTION, DEFAULT_WORKFLOW_MOTION } from "./movement";
import styles from "./WorkflowJourney.module.css";

export interface WorkflowJourneyProps {
  workflows: Workflow[];
}

const SEGMENT_VH = 70;

export function WorkflowJourney({ workflows }: WorkflowJourneyProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <StaticJourney workflows={workflows} />;
  }

  return <PinnedJourney workflows={workflows} />;
}

function PinnedJourney({ workflows }: WorkflowJourneyProps) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const total = workflows.length;
  const index = Math.min(total - 1, Math.floor(progress * total));
  const current = workflows[index];
  const primaryProductSlug = current.products[0];
  const motionSpec = WORKFLOW_MOTION[current.slug] ?? DEFAULT_WORKFLOW_MOTION;

  return (
    <div ref={ref} className={styles.track} style={{ height: `${total * SEGMENT_VH}vh` }}>
      <div className={styles.sticky}>
        <Container size="xl">
          <p className={styles.eyebrow}>Patient-handling workflows</p>
          <div className={styles.panel}>
            <div className={styles.textCol}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.22 } }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.12 } }}
                >
                  <span className={styles.number}>{current.number}</span>
                  <h3 className={styles.title}>{current.title}</h3>
                  <p className={styles.summary}>{current.summary}</p>
                  <div className={styles.productLinks}>
                    {current.products.map((slug) => (
                      <Link
                        key={slug}
                        href={`/workflows/${current.slug}/${slug}`}
                        className={styles.productLink}
                      >
                        {PRODUCT_NAMES[slug] ?? slug}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className={styles.dots} role="tablist" aria-label="Workflow">
                {workflows.map((workflow, i) => (
                  <span
                    key={workflow.slug}
                    className={[styles.dot, i === index && styles.dotActive]
                      .filter(Boolean)
                      .join(" ")}
                  />
                ))}
              </div>
            </div>

            <div className={styles.visualCol}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  className={styles.visualCard}
                  initial={motionSpec.initial}
                  animate={motionSpec.animate}
                  exit={motionSpec.exit}
                >
                  <ProductWordmark
                    name={PRODUCT_NAMES[primaryProductSlug] ?? current.familyName}
                    svgSrc={PRODUCT_WORDMARKS[primaryProductSlug]}
                    height={48}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

/** Reduced-motion / no-JS-scroll-math fallback -- same content, normal document flow, no pinning. */
function StaticJourney({ workflows }: WorkflowJourneyProps) {
  return (
    <Container size="xl">
      <p className={styles.eyebrow}>Patient-handling workflows</p>
      <div className={styles.staticList}>
        {workflows.map((workflow) => (
          <div key={workflow.slug} className={styles.staticItem}>
            <span className={styles.number}>{workflow.number}</span>
            <div>
              <h3 className={styles.title}>{workflow.title}</h3>
              <p className={styles.summary}>{workflow.summary}</p>
              <div className={styles.productLinks}>
                {workflow.products.map((slug) => (
                  <Link
                    key={slug}
                    href={`/workflows/${workflow.slug}/${slug}`}
                    className={styles.productLink}
                  >
                    {PRODUCT_NAMES[slug] ?? slug}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
