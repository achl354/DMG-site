import type { TargetAndTransition } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

export interface WorkflowMotionSpec {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
}

// AnimatePresence runs exit then enter sequentially (mode="wait", so the
// old and new visual cards never overlap in the DOM) -- keep exit short so
// the combined exit+enter duration stays well under a typical scroll step.
const ENTER = { duration: 0.32, ease: EASE_OUT };
const EXIT = { duration: 0.14, ease: EASE_OUT };

/**
 * Each workflow gets a distinct entry/exit direction so the motion itself
 * hints at the physical movement the workflow supports -- lateral transfer
 * slides sideways, floor recovery rises, turning arcs, etc. Deliberately
 * built from plain transform variants on the real product wordmark card,
 * not fabricated 3D product geometry (no accurate product models exist).
 */
export const WORKFLOW_MOTION: Record<string, WorkflowMotionSpec> = {
  "lateral-transfer": {
    initial: { opacity: 0, x: -72 },
    animate: { opacity: 1, x: 0, transition: ENTER },
    exit: { opacity: 0, x: 72, transition: EXIT },
  },
  "floor-recovery": {
    initial: { opacity: 0, y: 56 },
    animate: { opacity: 1, y: 0, transition: ENTER },
    exit: { opacity: 0, y: -40, transition: EXIT },
  },
  "manual-handling-support": {
    initial: { opacity: 0, x: -36, y: 36 },
    animate: { opacity: 1, x: 0, y: 0, transition: ENTER },
    exit: { opacity: 0, x: 36, y: -36, transition: EXIT },
  },
  "support-equipment": {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1, transition: ENTER },
    exit: { opacity: 0, scale: 1.05, transition: EXIT },
  },
  "sling-transfer": {
    initial: { opacity: 0, y: -44, rotate: -7 },
    animate: { opacity: 1, y: 0, rotate: 0, transition: ENTER },
    exit: { opacity: 0, y: 44, rotate: 7, transition: EXIT },
  },
  "turning-positioning": {
    initial: { opacity: 0, rotate: -16, scale: 0.94 },
    animate: { opacity: 1, rotate: 0, scale: 1, transition: ENTER },
    exit: { opacity: 0, rotate: 16, scale: 0.94, transition: EXIT },
  },
};

export const DEFAULT_WORKFLOW_MOTION: WorkflowMotionSpec = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: ENTER },
  exit: { opacity: 0, y: -24, transition: EXIT },
};
