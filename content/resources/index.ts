import type { ComponentType } from "react";
import EasiliftSpecSheet from "./easilift-spec-sheet.mdx";
import BuyingGuidePatientHandling from "./buying-guide-patient-handling.mdx";
import ReducingManualHandlingInjury from "./reducing-manual-handling-injury.mdx";
import { RESOURCE_META } from "./meta";

export { RESOURCE_META };

export const RESOURCE_BODIES: Record<string, ComponentType> = {
  "easilift-spec-sheet": EasiliftSpecSheet,
  "buying-guide-patient-handling": BuyingGuidePatientHandling,
  "reducing-manual-handling-injury": ReducingManualHandlingInjury,
};
