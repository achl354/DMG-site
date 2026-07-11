import type { TargetAndTransition } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import type { WorkflowMovement } from "@/lib/content/workflows";

export interface SceneMotionSpec {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
}

const ENTER = { duration: 0.4, ease: EASE_OUT };
const EXIT = { duration: 0.18, ease: EASE_OUT };

/**
 * One motion treatment per movement type (not per workflow slug) so the
 * direction of travel always matches how that class of workflow physically
 * moves a patient -- horizontal slide, vertical rise, diagonal/rotational
 * turn, curved elevation for a hoist/sling, etc. Data-driven off
 * Workflow.movementType rather than hard-coded per product.
 */
export const SCENE_MOTION: Record<WorkflowMovement, SceneMotionSpec> = {
  horizontal: {
    initial: { opacity: 0, x: -64 },
    animate: { opacity: 1, x: 0, transition: ENTER },
    exit: { opacity: 0, x: 64, transition: EXIT },
  },
  vertical: {
    initial: { opacity: 0, y: 56 },
    animate: { opacity: 1, y: 0, transition: ENTER },
    exit: { opacity: 0, y: -40, transition: EXIT },
  },
  diagonal: {
    initial: { opacity: 0, x: -36, y: 36 },
    animate: { opacity: 1, x: 0, y: 0, transition: ENTER },
    exit: { opacity: 0, x: 36, y: -36, transition: EXIT },
  },
  rotation: {
    initial: { opacity: 0, rotate: -14, scale: 0.94 },
    animate: { opacity: 1, rotate: 0, scale: 1, transition: ENTER },
    exit: { opacity: 0, rotate: 14, scale: 0.94, transition: EXIT },
  },
  curve: {
    initial: { opacity: 0, y: -44, rotate: -6 },
    animate: { opacity: 1, y: 0, rotate: 0, transition: ENTER },
    exit: { opacity: 0, y: 44, rotate: 6, transition: EXIT },
  },
};
