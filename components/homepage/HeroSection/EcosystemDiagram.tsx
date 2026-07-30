import { getAllWorkflows } from "@/lib/content/workflows";
import { WORKFLOW_ICONS } from "@/lib/content/assets";
import styles from "./EcosystemDiagram.module.css";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

interface DiagramNode {
  slug: string;
  number: string;
  title: string;
  icon: string;
  angleDeg: number;
}

const RADIUS_PCT = 38;

/**
 * Connector lines stop at half the hub-to-node distance rather than
 * reaching each node's own anchor point -- the node's icon/number/title
 * are all stacked at that same anchor, so a full-length line ran straight
 * through the icon (and, for the directly-above/below nodes, the number
 * and title too). 0.5 leaves clear margin before the node's box even
 * starts (~0.79 of the way out), not just before the icon.
 */
const LINE_END_RATIO = 0.5;

/**
 * Hexagon ring: 6 nodes at 60° increments starting at the top (-90°), going
 * clockwise in /workflows' own order -- not the reference catalogue
 * diagram's numbering, kept consistent with the mobile rotator's choice so
 * "workflow 01" always means the same thing site-wide.
 */
const NODES: DiagramNode[] = getAllWorkflows().map((workflow, index) => ({
  slug: workflow.slug,
  number: workflow.number,
  title: workflow.title,
  icon: WORKFLOW_ICONS[workflow.slug],
  angleDeg: -90 + index * 60,
}));

function nodeOffset(angleDeg: number, radius: number = RADIUS_PCT) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
}

/**
 * "Ease out back" -- standard overshoot curve (f(0)=0, f(1)=1, peaking
 * ~11% above 1 around t=0.58) used so each node pops slightly past its
 * resting scale/position before settling, rather than easing straight
 * to it. Purely a reshaping of the existing scroll-driven `reveal`
 * value (see nodeProgress) -- no timers, still driven entirely by
 * scroll position like everything else here.
 */
function easeOutBack(t: number) {
  const c = 1.70158;
  const t1 = t - 1;
  return 1 + (c + 1) * t1 ** 3 + c * t1 ** 2;
}

/**
 * Node assembly (spokes + fly-in) uses the first 65% of the scroll-driven
 * `progress`, not the full 0-1 range -- freeing the remaining 35% for the
 * perimeter sequence below (see PERIMETER_INSET_RATIO), without extending
 * the pin's total scroll distance (this codebase already walked back a
 * longer hero pin once before for feeling "too long-scrolling").
 */
const ASSEMBLY_SPLIT = 0.65;

/**
 * Radius the perimeter ring is drawn at -- deliberately larger than
 * RADIUS_PCT (the node anchor radius, where the hub spokes terminate).
 * The anchor sits at the CENTER of each node's icon/number/title stack,
 * not its outward tip, so a ring drawn at RADIUS_PCT cuts through the
 * inner half of every node instead of skirting past the outside of its
 * icon. This candidate value is tuned against the node box's own
 * rendered size (~12-13% of stageOuter's width from anchor to outer
 * edge at the default breakpoint) -- re-check if node box sizing changes.
 */
const PERIMETER_RADIUS_PCT = 51;

/**
 * Trims each end of a perimeter edge by this fraction of its length, same
 * reasoning as LINE_END_RATIO above -- a full-length edge would run
 * straight through both nodes' icon/number/title stacks.
 */
const PERIMETER_INSET_RATIO = 0.22;

/**
 * Once idle, one full oscillation plays out over this many px of
 * additional scroll -- short enough that the tilt visibly responds within
 * the brief window before the sticky diagram unpins and scrolls away.
 */
const DRIFT_PERIOD_PX = 480;
const DRIFT_ROTATE_Y_DEG = 10;
const DRIFT_ROTATE_X_DEG = 5;
/** px of apparent depth per % of hub-to-node radius, applied per node so
 * the idle rotation reads as an actual 3D ring (nodes at different depths
 * catching the light differently) rather than one flat plane pivoting. */
const NODE_DEPTH_PER_PCT = 1.1;
/**
 * Rotation angle alone is hard to read on flat icons with no shading --
 * these two make each node's own depth (see NODE_DEPTH_PER_PCT) visible
 * as a size/brightness cue too, once idle: the nodes on the "near" side of
 * the ring read slightly bigger and fully bright, the "far" side slightly
 * smaller and dimmer. Applied on top of (not instead of) the existing
 * reveal-based scale/opacity from the assembly animation, and only once
 * idle -- during assembly `reveal` is already doing that job.
 */
const NODE_DEPTH_SCALE_RANGE = 0.16;
const NODE_DEPTH_OPACITY_RANGE = 0.3;

export interface EcosystemDiagramProps {
  /** Scroll-driven assembly progress, 0-1. Omit for a fully-assembled static render (reduced motion / no JS). */
  progress?: number;
  /** px scrolled past assembly-complete -- drives the idle depth-rotation
   * below directly off live scroll position. 0 (or omitted) any time the
   * diagram isn't yet fully assembled. */
  idleDrift?: number;
}

/**
 * Desktop hero visual: a hexagon "ecosystem map" of the six EasiSystem™
 * workflows around a central hub, replacing the old EasiMoveSPU photo.
 * With a `progress` value it assembles node-by-node (fly-in + line draw-on)
 * on a tilted 3D plane that settles flat, then draws a perimeter line
 * linking the nodes to each other in sequence (01→02→...→06→01, closing
 * the loop) as the user keeps scrolling -- the hub-to-node spokes say
 * "each workflow relates to the system", this says "the workflows relate
 * to each other". Once idle it rotates subtly on two axes as a direct
 * function of continued scroll (see `idleDrift`) -- not a self-playing
 * timer -- so it reverses cleanly if the user scrolls back up. Without a
 * `progress` value it just renders fully assembled and flat, with no
 * rotation at all (the reduced-motion/no-JS case).
 */
export function EcosystemDiagram({ progress, idleDrift = 0 }: EcosystemDiagramProps) {
  const animated = progress !== undefined;
  const overallProgress = animated ? clamp(progress) : 1;
  const assemblyProgress = animated ? clamp(overallProgress / ASSEMBLY_SPLIT) : 1;
  const perimeterProgress = animated
    ? clamp((overallProgress - ASSEMBLY_SPLIT) / (1 - ASSEMBLY_SPLIT))
    : 1;
  const assemblyTiltDeg = animated ? -8 + 8 * assemblyProgress : 0;
  const idle = animated && overallProgress >= 1;

  const driftPhase = (idleDrift / DRIFT_PERIOD_PX) * Math.PI * 2;
  const rotateY = idle ? Math.sin(driftPhase) * DRIFT_ROTATE_Y_DEG : assemblyTiltDeg;
  const rotateX = idle ? Math.sin(driftPhase + Math.PI / 2) * DRIFT_ROTATE_X_DEG : 0;

  const nodeProgress = NODES.map((_, index) =>
    animated ? clamp(assemblyProgress * NODES.length - index) : 1,
  );
  const perimeterEdgeProgress = NODES.map((_, index) =>
    animated ? clamp(perimeterProgress * NODES.length - index) : 1,
  );

  /**
   * Closed hexagon through the same 6 points the perimeter edges connect
   * (see PERIMETER_RADIUS_PCT) -- not the inset/trimmed visible segments,
   * just the underlying ring -- used as the traveling pulse's motion path
   * below. Only rendered once idle: a self-playing loop makes sense here
   * (unlike the rotation, this is ambient "the system is alive" motion,
   * not something scroll should visibly drive) and gating it on `idle`
   * means reduced-motion users (who never get a `progress` prop, so
   * `idle` never becomes true) never render it at all.
   */
  const perimeterPathD =
    NODES.map((node, index) => {
      const { x, y } = nodeOffset(node.angleDeg, PERIMETER_RADIUS_PCT);
      return `${index === 0 ? "M" : "L"} ${50 + x} ${50 + y}`;
    }).join(" ") + " Z";

  return (
    <div className={styles.stageOuter}>
      <div className={styles.stage} style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}>
        <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {NODES.map((node, index) => {
            const { x, y } = nodeOffset(node.angleDeg);
            const length = Math.hypot(x, y) * LINE_END_RATIO;
            return (
              <line
                key={node.slug}
                x1={50}
                y1={50}
                x2={50 + x * LINE_END_RATIO}
                y2={50 + y * LINE_END_RATIO}
                className={styles.line}
                strokeDasharray={length}
                strokeDashoffset={length * (1 - nodeProgress[index])}
              />
            );
          })}

          {NODES.map((node, index) => {
            const next = NODES[(index + 1) % NODES.length];
            const from = nodeOffset(node.angleDeg, PERIMETER_RADIUS_PCT);
            const to = nodeOffset(next.angleDeg, PERIMETER_RADIUS_PCT);
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const x1 = 50 + from.x + dx * PERIMETER_INSET_RATIO;
            const y1 = 50 + from.y + dy * PERIMETER_INSET_RATIO;
            const x2 = 50 + to.x - dx * PERIMETER_INSET_RATIO;
            const y2 = 50 + to.y - dy * PERIMETER_INSET_RATIO;
            const length = Math.hypot(x2 - x1, y2 - y1);
            return (
              <line
                key={`${node.slug}-${next.slug}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={styles.perimeterLine}
                strokeDasharray={length}
                strokeDashoffset={length * (1 - perimeterEdgeProgress[index])}
              />
            );
          })}

          {idle && (
            <circle r={1.1} className={styles.pulse}>
              <animateMotion path={perimeterPathD} dur="6s" repeatCount="indefinite" rotate="auto" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>

        <div className={styles.hub}>
          <div className={styles.hubTextGroup}>
            <p className={styles.hubName}>
              Easi<strong>System</strong>
              <sup>™</sup>
            </p>
          </div>
        </div>

        {NODES.map((node, index) => {
          const { x, y } = nodeOffset(node.angleDeg);
          const reveal = nodeProgress[index];
          const bounced = easeOutBack(reveal);
          const depth = x * NODE_DEPTH_PER_PCT;
          const depthNorm = x / RADIUS_PCT;
          const depthScale = idle ? 1 + depthNorm * (NODE_DEPTH_SCALE_RANGE / 2) : 1;
          const depthOpacity = idle ? 1 - (NODE_DEPTH_OPACITY_RANGE / 2) * (1 - depthNorm) : 1;
          return (
            <div
              key={node.slug}
              className={styles.node}
              style={{
                left: `${50 + x}%`,
                top: `${50 + y}%`,
                opacity: reveal * depthOpacity,
                transform: `translate(-50%, -50%) scale(${(0.6 + 0.4 * bounced) * depthScale}) translateY(${(1 - bounced) * 16}px) translateZ(${depth}px)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- small decorative catalogue icon, not a page-weight-relevant photo */}
              <img src={node.icon} alt="" className={styles.nodeIcon} />
              <p className={styles.nodeNumber}>{node.number}</p>
              <p className={styles.nodeTitle}>{node.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
