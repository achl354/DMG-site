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
import TurningAndRepositioningTheRepeatedRisk from "./turning-and-repositioning-the-repeated-risk.mdx";
import PatientPositioningSupportsCareAndWorkforceSafety from "./patient-positioning-supports-care-and-workforce-safety.mdx";
import BariatricPatientHandlingMoreThanSafeWorkingLoad from "./bariatric-patient-handling-more-than-safe-working-load.mdx";
import TheRealCostOfPatientHandlingEquipment from "./the-real-cost-of-patient-handling-equipment.mdx";
import EfficientPatientHandlingFewerUnnecessarySteps from "./efficient-patient-handling-fewer-unnecessary-steps.mdx";
import PracticalInnovationInPatientHandling from "./practical-innovation-in-patient-handling.mdx";
import PatientHandlingRiskExtendsBeyondLifting from "./patient-handling-risk-extends-beyond-lifting.mdx";
import PatientHandlingEquipmentPlannedAroundTheCareTask from "./patient-handling-equipment-planned-around-the-care-task.mdx";
import WorkforceImpactOfMusculoskeletalInjuriesInHealthcare from "./workforce-impact-of-musculoskeletal-injuries-in-healthcare.mdx";
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
  "turning-and-repositioning-the-repeated-risk": TurningAndRepositioningTheRepeatedRisk,
  "patient-positioning-supports-care-and-workforce-safety": PatientPositioningSupportsCareAndWorkforceSafety,
  "bariatric-patient-handling-more-than-safe-working-load": BariatricPatientHandlingMoreThanSafeWorkingLoad,
  "the-real-cost-of-patient-handling-equipment": TheRealCostOfPatientHandlingEquipment,
  "efficient-patient-handling-fewer-unnecessary-steps": EfficientPatientHandlingFewerUnnecessarySteps,
  "practical-innovation-in-patient-handling": PracticalInnovationInPatientHandling,
  "patient-handling-risk-extends-beyond-lifting": PatientHandlingRiskExtendsBeyondLifting,
  "patient-handling-equipment-planned-around-the-care-task": PatientHandlingEquipmentPlannedAroundTheCareTask,
  "workforce-impact-of-musculoskeletal-injuries-in-healthcare": WorkforceImpactOfMusculoskeletalInjuriesInHealthcare,
};
