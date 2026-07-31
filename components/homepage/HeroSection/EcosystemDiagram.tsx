"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllWorkflows } from "@/lib/content/workflows";
import { WORKFLOW_ICONS, WORKFLOW_ICON_DIMENSIONS } from "@/lib/content/assets";
import { navigateWithViewTransition, isPlainLeftClick } from "@/lib/viewTransition";
import styles from "./EcosystemDiagram.module.css";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

interface DiagramNode {
  slug: string;
  number: string;
  title: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
  angleDeg: number;
}

const RADIUS_PCT = 38;

/**
 * Hexagon ring: 6 nodes at 60° increments starting at the top (-90°), going
 * clockwise in /workflows' own order -- not the reference catalogue
 * diagram's numbering, kept consistent with the mobile rotator's choice so
 * "workflow 01" always means the same thing site-wide.
 */
const NODES: DiagramNode[] = getAllWorkflows().map((workflow, index) => {
  const [iconWidth, iconHeight] = WORKFLOW_ICON_DIMENSIONS[workflow.slug];
  return {
    slug: workflow.slug,
    number: workflow.number,
    title: workflow.title,
    icon: WORKFLOW_ICONS[workflow.slug],
    iconWidth,
    iconHeight,
    angleDeg: -90 + index * 60,
  };
});

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
 * Node assembly (fly-in + tilt-to-flat) uses only the first 70% of the
 * scroll-driven `progress`, not the full 0-1 range -- measured directly:
 * the sticky diagram's native CSS pin actually releases (and starts
 * scrolling the diagram up behind the header) a bit BEFORE `progress`
 * reached 1 at the old (pre-split) pacing, so idle/the pulse used to start
 * only once the topmost node had already been scrolling behind the header
 * for ~20-30px. Finishing assembly earlier within the SAME pin distance
 * (not a longer one -- see HeroSection.tsx's PIN_SCROLL_DISTANCE,
 * unchanged) leaves the remainder as genuine fully-assembled-and-visible
 * idle time before that release point, instead of that window not
 * existing at all. 0.8 first (a ~50px window before clipping) was too
 * narrow to reliably land in under a real wheel/trackpad scroll gesture,
 * where one tick's momentum can easily overshoot a window that size --
 * 0.7 roughly doubles it (~115px measured). Exported so HeroSection.tsx's
 * idleDrift calculation can start counting from this same earlier point,
 * not the old 100% mark.
 */
export const ASSEMBLY_SPLIT = 0.6;

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

/** Half-height of the pulse's triangle (its tip extends 1.2x further out
 * along its point) -- see ORBIT_RADIUS_PCT for its clearance from nodes. */
const PULSE_RADIUS = 1;

/**
 * Closed hexagon through 6 points at ORBIT_RADIUS_PCT -- not rendered as
 * a visible ring, just the traveling pulse's motion path (see the `idle`
 * block below). Computed once at module scope, not per render -- it only
 * depends on the two constants above and the fixed NODES list, never on
 * `progress`/`idleDrift`, so recomputing it on every scroll-driven
 * re-render bought nothing.
 */
const orbitPathD =
  NODES.map((node, index) => {
    const { x, y } = nodeOffset(node.angleDeg, ORBIT_RADIUS_PCT);
    return `${index === 0 ? "M" : "L"} ${50 + x} ${50 + y}`;
  }).join(" ") + " Z";

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
  const router = useRouter();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const animated = progress !== undefined;
  const overallProgress = animated ? clamp(progress) : 1;
  const assemblyProgress = animated ? clamp(overallProgress / ASSEMBLY_SPLIT) : 1;
  const assemblyTiltDeg = animated ? -8 + 8 * assemblyProgress : 0;
  const idle = animated && overallProgress >= ASSEMBLY_SPLIT;

  const driftPhase = (idleDrift / DRIFT_PERIOD_PX) * Math.PI * 2;
  const rotateY = idle ? Math.sin(driftPhase) * DRIFT_ROTATE_Y_DEG : assemblyTiltDeg;
  const rotateX = idle ? Math.sin(driftPhase + Math.PI / 2) * DRIFT_ROTATE_X_DEG : 0;

  const nodeProgress = NODES.map((_, index) =>
    animated ? clamp(assemblyProgress * NODES.length - index) : 1,
  );

  return (
    <div className={styles.stageOuter}>
      <div className={styles.stage} style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}>
        <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {/*
           * Always mounted (not conditional on `idle`) -- its position
           * and blink are a plain CSS animation that just keeps running,
           * gated only by this group's opacity. Conditionally mounting the
           * triangle itself (as an earlier version did) meant every idle ->
           * not-idle -> idle flip near the pin's release point restarted
           * the animation from its first keyframe, snapping the pulse back
           * to the start of its path instead of continuing smoothly.
           */}
          <g style={{ opacity: idle ? 1 : 0 }}>
            {/* Arrowhead pointing along +x (right) when unrotated -- paired
                with .pulse's offset-rotate: auto (see that rule's comment),
                which rotates this to match the path's own tangent direction
                at every point, so it always points the way it's currently
                traveling and only literally points right while passing
                along the orbit's right-hand side. */}
            <polygon
              points={`${PULSE_RADIUS * 1.2},0 ${-PULSE_RADIUS * 0.7},${-PULSE_RADIUS} ${-PULSE_RADIUS * 0.7},${PULSE_RADIUS}`}
              className={styles.pulse}
              style={{ offsetPath: `path("${orbitPathD}")` }}
            />
          </g>
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
          const isHovered = idle && hoveredSlug === node.slug;
          const depthScale = idle ? 1 + depthNorm * (NODE_DEPTH_SCALE_RANGE / 2) : 1;
          const depthOpacity = idle ? 1 - (NODE_DEPTH_OPACITY_RANGE / 2) * (1 - depthNorm) : 1;
          const hoverScale = isHovered ? 1.08 : 1;
          const href = `/workflows/${node.slug}`;
          return (
            <Link
              key={node.slug}
              href={href}
              tabIndex={idle ? 0 : -1}
              className={`${styles.node} ${idle ? styles.nodeSettled : ""}`}
              style={{
                left: `${50 + x}%`,
                top: `${50 + y}%`,
                opacity: isHovered ? 1 : reveal * depthOpacity,
                transform: `translate(-50%, -50%) scale(${(0.6 + 0.4 * bounced) * depthScale * hoverScale}) translateY(${(1 - bounced) * 16}px) translateZ(${depth}px)`,
                // Inline, not left to the .node/.node:hover CSS rule --
                // an inline style always outranks any stylesheet rule
                // regardless of specificity, sidestepping both the global
                // `a:hover { text-decoration: underline }` reset AND
                // production minifiers that (wrongly, for this
                // cross-stylesheet case) treat a same-value `:hover` rule
                // as redundant and drop it.
                textDecoration: "none",
              }}
              onMouseEnter={() => setHoveredSlug(node.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onFocus={() => setHoveredSlug(node.slug)}
              onBlur={() => setHoveredSlug(null)}
              onClick={(event) => {
                if (!isPlainLeftClick(event)) return;
                event.preventDefault();
                navigateWithViewTransition(router, href);
              }}
            >
              {/* Recolored to the exact brand teal via CSS mask (background-color
                  painted through the icon's own alpha channel) rather than shown
                  as its own ink-900 artwork -- matches the teal treatment used
                  for outline art elsewhere on this page (WorkflowCard, the
                  homepage scroll section). aspectRatio is set inline since a
                  masked element has no intrinsic size the way an <img> does. */}
              <span
                aria-hidden="true"
                className={styles.nodeIcon}
                style={
                  {
                    maskImage: `url(${node.icon})`,
                    WebkitMaskImage: `url(${node.icon})`,
                    aspectRatio: `${node.iconWidth} / ${node.iconHeight}`,
                  } as CSSProperties
                }
              />
              <p className={styles.nodeNumber}>{node.number}</p>
              <p className={styles.nodeTitle}>{node.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
