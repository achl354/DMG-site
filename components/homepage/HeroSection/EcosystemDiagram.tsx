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
 * Radius the traveling pulse orbits at (see the `idle` block below) -- an
 * inner lane between the hub and the node content. Node clearance (the
 * hard requirement -- the pulse must never touch a node's icon/text) gets
 * easier the smaller this is, since the hexagon path's vertices (closest
 * approach to each node) pull back as the radius shrinks. Clearing the
 * hub is NOT a requirement here -- the hub is a single flat color, not
 * detailed content, so the pulse grazing or briefly ducking behind its
 * edge (which happens at the path's edge midpoints, which sit closer to
 * the hub than its vertices do) reads fine, like a light passing behind
 * an object. 18 leaves >14px of node clearance at every vertex and
 * midpoint (measured against each node's rendered bounding box) --
 * PULSE_RADIUS is sized well within that. Re-check if node sizing changes.
 */
const ORBIT_RADIUS_PCT = 18;

/** See ORBIT_RADIUS_PCT. */
const PULSE_RADIUS = 1;

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
 * With a `progress` value it assembles node-by-node (fly-in, no connector
 * lines to the hub) on a tilted 3D plane that settles flat. Once idle it
 * rotates subtly on two axes as a direct function of continued scroll
 * (see `idleDrift`) -- not a self-playing timer -- so it reverses cleanly
 * if the user scrolls back up, and a pulse starts looping in the gap
 * between the hub and the nodes (the one self-playing animation here --
 * ambient "the system is alive" motion, not something scroll should
 * visibly drive). Without a `progress` value it just renders fully
 * assembled and flat, with no rotation or pulse at all (the
 * reduced-motion/no-JS case).
 */
export function EcosystemDiagram({ progress, idleDrift = 0 }: EcosystemDiagramProps) {
  const animated = progress !== undefined;
  const overallProgress = animated ? clamp(progress) : 1;
  const assemblyTiltDeg = animated ? -8 + 8 * overallProgress : 0;
  const idle = animated && overallProgress >= 1;

  const driftPhase = (idleDrift / DRIFT_PERIOD_PX) * Math.PI * 2;
  const rotateY = idle ? Math.sin(driftPhase) * DRIFT_ROTATE_Y_DEG : assemblyTiltDeg;
  const rotateX = idle ? Math.sin(driftPhase + Math.PI / 2) * DRIFT_ROTATE_X_DEG : 0;

  const nodeProgress = NODES.map((_, index) =>
    animated ? clamp(overallProgress * NODES.length - index) : 1,
  );

  /**
   * Closed hexagon through 6 points at ORBIT_RADIUS_PCT -- not rendered
   * as a visible ring, just the traveling pulse's motion path below.
   */
  const orbitPathD =
    NODES.map((node, index) => {
      const { x, y } = nodeOffset(node.angleDeg, ORBIT_RADIUS_PCT);
      return `${index === 0 ? "M" : "L"} ${50 + x} ${50 + y}`;
    }).join(" ") + " Z";

  return (
    <div className={styles.stageOuter}>
      <div className={styles.stage} style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}>
        <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {idle && (
            <circle r={PULSE_RADIUS} className={styles.pulse}>
              <animateMotion path={orbitPathD} dur="6s" repeatCount="indefinite" rotate="auto" />
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
