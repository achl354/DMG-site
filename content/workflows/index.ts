import type { Workflow } from "@/lib/content/workflows";
import { lateralTransfer } from "./lateral-transfer";
import { floorRecovery } from "./floor-recovery";
import { manualHandlingSupport } from "./manual-handling-support";
import { slingTransfer } from "./sling-transfer";
import { turningPositioning } from "./turning-positioning";
import { airSupply } from "./air-supply";
import { equipmentStorage } from "./equipment-storage";

export const WORKFLOWS: Workflow[] = [
  lateralTransfer,
  floorRecovery,
  manualHandlingSupport,
  slingTransfer,
  turningPositioning,
  airSupply,
  equipmentStorage,
];
