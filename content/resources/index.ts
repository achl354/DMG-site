import type { ComponentType } from "react";
import EasiliftSpecSheet from "./easilift-spec-sheet.mdx";
import BuyingGuidePatientHandling from "./buying-guide-patient-handling.mdx";
import ReducingManualHandlingInjury from "./reducing-manual-handling-injury.mdx";
import EverydayPatientHandlingBeyondTransfers from "./everyday-patient-handling-beyond-transfers.mdx";
import PatientHandlingTrainingNeedsTheRightSystem from "./patient-handling-training-needs-the-right-system.mdx";
import MatchThePatientHandlingSolutionToTheMovement from "./match-the-patient-handling-solution-to-the-movement.mdx";
import EquipmentAccessIsPartOfPatientHandlingSafety from "./equipment-access-is-part-of-patient-handling-safety.mdx";
import ReusableOrSinglePatientUse from "./reusable-or-single-patient-use.mdx";
import PlanningPatientHandlingAsClinicalInfrastructure from "./planning-patient-handling-as-clinical-infrastructure.mdx";
import { RESOURCE_META } from "./meta";

export { RESOURCE_META };

export const RESOURCE_BODIES: Record<string, ComponentType> = {
  "easilift-spec-sheet": EasiliftSpecSheet,
  "buying-guide-patient-handling": BuyingGuidePatientHandling,
  "reducing-manual-handling-injury": ReducingManualHandlingInjury,
  "everyday-patient-handling-beyond-transfers": EverydayPatientHandlingBeyondTransfers,
  "patient-handling-training-needs-the-right-system": PatientHandlingTrainingNeedsTheRightSystem,
  "match-the-patient-handling-solution-to-the-movement": MatchThePatientHandlingSolutionToTheMovement,
  "equipment-access-is-part-of-patient-handling-safety": EquipmentAccessIsPartOfPatientHandlingSafety,
  "reusable-or-single-patient-use": ReusableOrSinglePatientUse,
  "planning-patient-handling-as-clinical-infrastructure": PlanningPatientHandlingAsClinicalInfrastructure,
};
