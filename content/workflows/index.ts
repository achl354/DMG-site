import type { Workflow } from "@/lib/content/workflows";
import { lateralTransfer } from "./lateral-transfer";
import { floorRecovery } from "./floor-recovery";
import { manualHandlingSupport } from "./manual-handling-support";
import { slingTransfer } from "./sling-transfer";
import { turningPositioning } from "./turning-positioning";
import { supportEquipment } from "./support-equipment";

export const WORKFLOWS: Workflow[] = [
  lateralTransfer,
  floorRecovery,
  manualHandlingSupport,
  slingTransfer,
  turningPositioning,
  supportEquipment,
];
