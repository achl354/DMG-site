const PATHS: Record<string, string> = {
  // Lateral transfer -- a mat/surface outline, echoing the transfer mat itself.
  "lateral-transfer": "M3 7.5h18v9H3z M3 12h18",
  // Floor recovery -- lifting a patient up off the floor.
  "floor-recovery": "M12 19V5 M6 10l6-6 6 6",
  // Turning and positioning -- rotation.
  "turning-positioning": "M4 12a8 8 0 1 1 2.5 5.8 M4 12v5h5",
  // Hoist-based transfer -- a hook, echoing a hoist's lifting point.
  "sling-transfer": "M12 4v7a4 4 0 0 0 8 0 M8 20l4-4 4 4",
  // Manual handling support -- two overlapping sheets/boards.
  "manual-handling-support": "M5 8h11v9H5z M8 5h11v9",
  // Air supply and equipment storage -- airflow waves.
  "support-equipment": "M3 9c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 M3 15c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0",
};

export interface WorkflowSolutionsIconProps {
  slug: string;
  className?: string;
}

/** Small category icon shown beside the "Workflow solutions" label on each
 * workflow card -- a quick visual cue for the kind of movement/equipment
 * involved, distinct from the large cropped scene illustration. */
export function WorkflowSolutionsIcon({ slug, className }: WorkflowSolutionsIconProps) {
  const d = PATHS[slug];
  if (!d) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
