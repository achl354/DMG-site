"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/layout";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { usePinnedScrollScenes } from "@/components/motion/ScrollScene";
import { useMatchMedia } from "@/components/motion/useMatchMedia";
import { trackEvent } from "@/lib/analytics";
import type { Workflow } from "@/lib/content/workflows";
import { WorkflowScene } from "@/components/homepage/WorkflowScene/WorkflowScene";
import { ScrollProgress } from "@/components/homepage/ScrollProgress/ScrollProgress";
import { SCENE_MOTION } from "@/components/homepage/sceneMotion";
import styles from "./WorkflowStory.module.css";

export interface WorkflowStoryProps {
  scenes: Workflow[];
}

const SEGMENT_VH = 50;
/** How long a scene must stay active before it counts as "viewed" for analytics. */
const VIEW_DWELL_MS = 1000;

export function WorkflowStory({ scenes }: WorkflowStoryProps) {
  const reducedMotion = useReducedMotion();
  // Desktop/tablet gets the pinned split-screen experience; mobile always
  // gets normal stacked scrolling, per the mobile-behaviour requirements --
  // this is a viewport check, not just a reduced-motion fallback.
  const isDesktop = useMatchMedia("(min-width: 768px)");

  return (
    <div id="workflow-story" className={styles.wrapper}>
      <Container size="xl">
        <h2 className="sr-only">Patient-handling workflows</h2>
        <p className={styles.eyebrow} aria-hidden="true">
          Patient-handling workflows
        </p>
      </Container>
      {reducedMotion || !isDesktop ? (
        <StackedStory scenes={scenes} />
      ) : (
        <PinnedStory scenes={scenes} />
      )}
    </div>
  );
}

function useSceneViewedTracking(slug: string) {
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (firedRef.current.has(slug)) return;
    const timer = window.setTimeout(() => {
      firedRef.current.add(slug);
      trackEvent("workflow_scene_viewed", { workflow: slug });
    }, VIEW_DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [slug]);
}

function PinnedStory({ scenes }: WorkflowStoryProps) {
  const total = scenes.length;
  const { containerRef, stickyRef, index } = usePinnedScrollScenes(total);
  const current = scenes[index];
  const motionSpec = SCENE_MOTION[current.movementType];

  useSceneViewedTracking(current.slug);

  return (
    <div
      ref={containerRef}
      className={styles.track}
      style={{ height: `${total * SEGMENT_VH}vh` }}
    >
      <div ref={stickyRef} className={styles.sticky}>
        <Container size="xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={motionSpec.initial}
              animate={motionSpec.animate}
              exit={motionSpec.exit}
            >
              <WorkflowScene
                workflow={current}
                sceneNumber={String(index + 1).padStart(2, "0")}
                onProductLinkClick={(slug) => trackEvent("workflow_cta_clicked", { workflow: current.slug, product: slug })}
              />
            </motion.div>
          </AnimatePresence>

          <ScrollProgress
            labels={scenes.map((_, i) => String(i + 1).padStart(2, "0"))}
            activeIndex={index}
          />
        </Container>
      </div>
    </div>
  );
}

/** Reduced-motion and mobile fallback: normal document scroll, no pinning. */
function StackedStory({ scenes }: WorkflowStoryProps) {
  return (
    <Container size="xl">
      <div className={styles.staticList}>
        {scenes.map((scene, i) => (
          <StackedScene
            key={scene.slug}
            workflow={scene}
            sceneNumber={String(i + 1).padStart(2, "0")}
          />
        ))}
      </div>
    </Container>
  );
}

function StackedScene({ workflow, sceneNumber }: { workflow: Workflow; sceneNumber: string }) {
  return (
    <motion.div
      className={styles.staticItem}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.35 }}
      onViewportEnter={() => {
        window.setTimeout(() => {
          trackEvent("workflow_scene_viewed", { workflow: workflow.slug });
        }, VIEW_DWELL_MS);
      }}
    >
      <WorkflowScene
        workflow={workflow}
        sceneNumber={sceneNumber}
        onProductLinkClick={(slug) => trackEvent("workflow_cta_clicked", { workflow: workflow.slug, product: slug })}
      />
    </motion.div>
  );
}
