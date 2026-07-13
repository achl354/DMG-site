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

function nodeOffset(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: RADIUS_PCT * Math.cos(rad), y: RADIUS_PCT * Math.sin(rad) };
}

export interface EcosystemDiagramProps {
  /** Scroll-driven assembly progress, 0-1. Omit for a fully-assembled static render (reduced motion / no JS). */
  progress?: number;
}

/**
 * Desktop hero visual: a hexagon "ecosystem map" of the six EasiSystem™
 * workflows around a central hub, replacing the old EasiMoveSPU photo.
 * With a `progress` value it assembles node-by-node (fly-in + line draw-on)
 * on a tilted 3D plane that settles flat, then drifts gently once complete;
 * without one it just renders fully assembled and flat.
 */
export function EcosystemDiagram({ progress }: EcosystemDiagramProps) {
  const animated = progress !== undefined;
  const overallProgress = animated ? clamp(progress) : 1;
  const tiltDeg = animated ? -8 + 8 * overallProgress : 0;
  const idle = animated && overallProgress >= 1;

  const nodeProgress = NODES.map((_, index) =>
    animated ? clamp(overallProgress * NODES.length - index) : 1,
  );

  return (
    <div className={styles.stageOuter}>
      <div
        className={[styles.stage, idle && styles.idle].filter(Boolean).join(" ")}
        style={idle ? undefined : { transform: `rotateY(${tiltDeg}deg)` }}
      >
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
        </svg>

        <div className={styles.hub}>
          <p className={styles.hubName}>
            Easi<strong>System</strong>
            <sup>™</sup>
          </p>
          <p className={styles.hubLabel}>The ecosystem</p>
        </div>

        {NODES.map((node, index) => {
          const { x, y } = nodeOffset(node.angleDeg);
          const reveal = nodeProgress[index];
          return (
            <div
              key={node.slug}
              className={styles.node}
              style={{
                left: `${50 + x}%`,
                top: `${50 + y}%`,
                opacity: reveal,
                transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * reveal}) translateY(${(1 - reveal) * 16}px)`,
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
