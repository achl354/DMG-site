import type { Workflow } from "@/lib/content/workflows";
import { lateralTransfer } from "./lateral-transfer";
import { floorRecovery } from "./floor-recovery";
import { manualHandlingSupport } from "./manual-handling-support";
import { slingTransfer } from "./sling-transfer";
import { turningPositioning } from "./turning-positioning";
import { supportEquipment } from "./support-equipment";

/** Order matches the homepage's PORTFOLIO_SCENES sequence (see
 * lib/content/portfolioScenes.ts) -- previously these two pages disagreed
 * (this catalogue had manual-handling-support before turning-positioning,
 * the homepage the reverse), so the same workflow carried two different
 * numbers depending which page a visitor was on. */
export const WORKFLOWS: Workflow[] = [
  lateralTransfer,
  floorRecovery,
  turningPositioning,
  slingTransfer,
  manualHandlingSupport,
  supportEquipment,
];
