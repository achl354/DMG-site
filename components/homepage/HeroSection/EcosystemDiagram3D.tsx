"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { Html, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { getAllWorkflows } from "@/lib/content/workflows";
import { WORKFLOW_ICONS, WORKFLOW_ICON_DIMENSIONS } from "@/lib/content/assets";

/**
 * EXPERIMENTAL -- a WebGL (React Three Fiber) comparison build of
 * EcosystemDiagram.tsx's idle state, prototyping whether real lighting/depth
 * reads as more "alive" than the shipped CSS-3D version. Not wired into the
 * real homepage; only mounted from app/experimental/hero-3d for side-by-side
 * comparison. Ports the CSS version's actual formulas (easeOutBack,
 * ASSEMBLY_SPLIT, depth scale/opacity, NODE_VISIT_ORDER glow stagger, the
 * exact hexagonal pulse path) rather than approximating them, so the two are
 * comparable at more than a glance -- see EcosystemDiagram.tsx for the
 * canonical version of every formula duplicated here.
 *
 * Colors are hardcoded (not read from the CSS custom properties) since
 * Three.js materials need real color values, not var() references --
 * kept in sync by hand with styles/tokens/colors.css's --brand/--ink-900/
 * --teal-300, and EcosystemDiagram.module.css's .nodeNumber/.nodeTitle.
 */
const BRAND_TEAL = "#005855";
const INK_900 = "#16211E";
const TEAL_300 = "#A7CBC8";
const RING_RADIUS = 2.6;
const ORBIT_RADIUS = RING_RADIUS * (18 / 38); // matches ORBIT_RADIUS_PCT/RADIUS_PCT's ratio
/** Matches EcosystemDiagram.module.css's pulseOrbit/pulseBlink durations. */
const PULSE_PERIOD_S = 7;
const PULSE_BLINK_PERIOD_S = 1.5;
const ASSEMBLY_SPLIT = 0.6;
const NODE_VISIT_ORDER = [0, 5, 4, 3, 2, 1];
const NODE_DEPTH_SCALE_RANGE = 0.16;
const NODE_DEPTH_OPACITY_RANGE = 0.3;
/** World-units equivalent of NODE_DEPTH_PER_PCT's px-per-% depth parallax --
 * not a unit-for-unit port (px and Three.js world units aren't comparable),
 * just enough to read as the same kind of subtle per-node depth offset. */
const DEPTH_WORLD_PER_UNIT = 0.5;

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

/** Same overshoot curve as EcosystemDiagram.tsx's easeOutBack. */
function easeOutBack(t: number) {
  const c = 1.70158;
  const t1 = t - 1;
  return 1 + (c + 1) * t1 ** 3 + c * t1 ** 2;
}

/** Same shape as .nodeIconPulse's nodeIconGlow keyframes (peak at phase 0,
 * eased back to rest by 20% of the period) -- see that rule's own comment
 * for why peaking at 0%, not partway through, is what keeps this synced. */
function glowScale(elapsedSec: number, delaySec: number) {
  const local = (((elapsedSec - delaySec) % PULSE_PERIOD_S) + PULSE_PERIOD_S) % PULSE_PERIOD_S;
  const phase = local / PULSE_PERIOD_S;
  if (phase >= 0.2) return 1;
  const t = phase / 0.2;
  return 1.18 - 0.18 * t;
}

/** Same shape as .pulse's pulseBlink keyframes (0.4 at 0%/100%, 1 at 50%). */
function pulseBlink(elapsedSec: number) {
  const t = (elapsedSec % PULSE_BLINK_PERIOD_S) / PULSE_BLINK_PERIOD_S;
  return 0.4 + 0.6 * (0.5 - 0.5 * Math.cos(t * Math.PI * 2));
}

interface Node3D {
  slug: string;
  number: string;
  title: string;
  icon: string;
  aspect: number;
  angleRad: number;
}

function useNodes(): Node3D[] {
  return useMemo(
    () =>
      getAllWorkflows().map((workflow, index) => {
        const [w, h] = WORKFLOW_ICON_DIMENSIONS[workflow.slug];
        return {
          slug: workflow.slug,
          number: workflow.number,
          title: workflow.title,
          icon: WORKFLOW_ICONS[workflow.slug],
          aspect: w / h,
          // Same -90deg start, clockwise layout as the CSS version's NODES.
          angleRad: -Math.PI / 2 + index * ((Math.PI * 2) / 6),
        };
      }),
    [],
  );
}

/**
 * A minimal unlit shader, not meshStandardMaterial + alphaMap -- an earlier
 * pass tried alphaMap (Three.js's CSS mask-image equivalent) and it
 * rendered as flat gray rectangles: alphaMap samples a fixed channel of a
 * purpose-built grayscale texture, not an arbitrary PNG's own real alpha
 * channel the way CSS mask-image does. This shader instead samples the
 * icon PNG's actual alpha directly and outputs it against a flat uniform
 * color -- the true equivalent of the CSS version's mask-image +
 * background-color trick.
 *
 * drei's shaderMaterial() factory + extend(), not a raw <shaderMaterial>
 * JSX element -- a raw <shaderMaterial uniforms={{...}}> pass rendered
 * every icon as flat gray (confirmed by sampling real output pixels: R/G/B
 * channels came back equal, i.e. achromatic, not the expected teal skew).
 * R3F's per-frame prop diffing doesn't reliably reach into a plain
 * `uniforms` object passed as a single prop; drei's factory instead
 * exposes each uniform (map/color/opacity below) as its own top-level JSX
 * prop AND a direct settable property on the material instance, which is
 * the supported, reliable way to do custom shaders in R3F.
 */
const IconMaterialImpl = shaderMaterial(
  { map: null as THREE.Texture | null, color: new THREE.Color(BRAND_TEAL), opacity: 1 },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    uniform sampler2D map;
    uniform vec3 color;
    uniform float opacity;
    void main() {
      vec4 texel = texture2D(map, vUv);
      gl_FragColor = vec4(color, texel.a * opacity);
    }
  `,
);
extend({ IconMaterial: IconMaterialImpl });

declare module "@react-three/fiber" {
  interface ThreeElements {
    iconMaterial: ThreeElements["shaderMaterial"] & {
      map?: THREE.Texture | null;
      color?: THREE.Color | string;
      opacity?: number;
    };
  }
}

function NodeMesh({ node, index, reveal, idle }: { node: Node3D; index: number; reveal: number; idle: boolean }) {
  const texture = useLoader(THREE.TextureLoader, node.icon);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<InstanceType<typeof IconMaterialImpl>>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const x = Math.cos(node.angleRad) * RING_RADIUS;
  // Negated -- node.angleRad follows the CSS version's own Y-down screen
  // convention (positive angle = further down), but Three.js world space
  // is Y-up. Without this flip every node renders at its vertically
  // mirrored position (confirmed by rendering it once un-negated: node
  // index 3, "Hoist-based transfer", which the CSS version places at the
  // bottom, rendered at the top instead).
  const y = -Math.sin(node.angleRad) * RING_RADIUS;
  const depthNorm = Math.cos(node.angleRad); // == CSS version's x / RADIUS_PCT exactly
  const delaySec = NODE_VISIT_ORDER[index] * (PULSE_PERIOD_S / 6);

  const height = 0.62;
  const width = height * node.aspect;

  useFrame(({ clock }) => {
    if (!groupRef.current || !materialRef.current) return;
    const bounced = easeOutBack(reveal);
    const depthScale = idle ? 1 + depthNorm * (NODE_DEPTH_SCALE_RANGE / 2) : 1;
    const depthOpacity = idle ? 1 - (NODE_DEPTH_OPACITY_RANGE / 2) * (1 - depthNorm) : 1;
    const glow = idle ? glowScale(clock.elapsedTime, delaySec) : 1;

    groupRef.current.scale.setScalar((0.6 + 0.4 * bounced) * depthScale * glow);
    groupRef.current.position.set(x, y, depthNorm * DEPTH_WORLD_PER_UNIT - (1 - bounced) * 0.35);

    const alpha = reveal * depthOpacity;
    materialRef.current.opacity = alpha;
    if (labelRef.current) {
      labelRef.current.style.opacity = reveal > 0.85 ? String(alpha) : "0";
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <iconMaterial ref={materialRef} map={texture} color={BRAND_TEAL} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Billboarded (always faces the camera), not tilted with the group's
          own rotation like the icon plane above -- deliberately, so labels
          stay legible at any tilt angle rather than literally matching the
          CSS version's flat-plane-embedded text, which can foreshorten to
          the point of being hard to read at steep angles. */}
      {/* World-space position offset (below the icon's own center), not a
          CSS marginTop -- distanceFactor scaling made font sizes
          unpredictable relative to the literal 15px/19px set below, and a
          world-space offset positions this correctly regardless of camera
          distance instead of guessing a CSS px value that only happens to
          work at one specific zoom. */}
      <Html position={[0, -0.62, 0]} center style={{ pointerEvents: "none" }}>
        <div
          ref={labelRef}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "120px",
            textAlign: "center",
            opacity: 0,
            transition: "opacity 120ms linear",
          }}
        >
          <span
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: TEAL_300,
            }}
          >
            {node.number}
          </span>
          <span
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "19px",
              fontWeight: 600,
              lineHeight: 1.28,
              color: INK_900,
            }}
          >
            {node.title}
          </span>
        </div>
      </Html>
    </group>
  );
}

/**
 * Hexagonal prism (a 6-sided cylinder) standing in for the CSS version's
 * clip-path hexagon hub.
 *
 * emissive floor + tuned light intensities, not the original plain
 * meshStandardMaterial -- pixel-sampling the first version's actual
 * rendered output found it running at roughly half the intended
 * brightness (RGB ~50 vs brand teal's real 88/85), with only a ~1%
 * top-to-bottom gradient -- too dim and too flat to read as anything.
 * Root cause: R3F's <Canvas> defaults to ACESFilmicToneMapping, a
 * filmic curve that compresses/darkens exactly this kind of flat mid-tone
 * color (fixed via the `flat` prop on Canvas below, not here). The
 * emissive term here is a deliberate floor UNDER that fix, not a
 * workaround for it -- it guarantees the shadowed side never drifts too
 * far from brand teal even at grazing light angles, while the directional
 * lights (now meaningfully brighter, see EcosystemDiagram3D's own Canvas)
 * still add real, visible-by-eye shading on top of that floor.
 */
function Hub() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.95, 0.95, 0.4, 6]} />
      <meshStandardMaterial
        color={BRAND_TEAL}
        emissive={BRAND_TEAL}
        emissiveIntensity={0.35}
        metalness={0.1}
        roughness={0.45}
      />
    </mesh>
  );
}

/**
 * Traveling pulse -- now the CSS version's actual hexagon (piecewise-linear
 * across the same 6 vertices orbitPathD uses, in NODES' own clockwise
 * order), not the approximated circle from the first prototype pass.
 */
function Pulse({ nodes, idle }: { nodes: Node3D[]; idle: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Y negated -- same CSS-Y-down vs Three.js-Y-up mismatch as NodeMesh's own
  // position calculation above; without it the pulse's hexagon path would
  // be vertically mirrored relative to where the (correctly Y-flipped)
  // nodes actually sit, breaking the exact-sync property between the two.
  const hexPoints = useMemo(
    () => nodes.map((node) => new THREE.Vector2(Math.cos(node.angleRad) * ORBIT_RADIUS, -Math.sin(node.angleRad) * ORBIT_RADIUS)),
    [nodes],
  );

  useFrame(({ clock }) => {
    if (!ref.current || !groupRef.current) return;
    groupRef.current.visible = idle;
    if (!idle) return;

    const t = (clock.elapsedTime % PULSE_PERIOD_S) / PULSE_PERIOD_S;
    const segmentFloat = t * hexPoints.length;
    const segment = Math.floor(segmentFloat) % hexPoints.length;
    const localT = segmentFloat - Math.floor(segmentFloat);
    const p0 = hexPoints[segment];
    const p1 = hexPoints[(segment + 1) % hexPoints.length];
    const x = p0.x + (p1.x - p0.x) * localT;
    const y = p0.y + (p1.y - p0.y) * localT;
    ref.current.position.set(x, y, 0.06);
    ref.current.rotation.z = Math.atan2(p1.y - p0.y, p1.x - p0.x) - Math.PI / 2;

    const material = ref.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = pulseBlink(clock.elapsedTime) * 1.4;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={ref}>
        <coneGeometry args={[0.08, 0.2, 3]} />
        <meshStandardMaterial color={INK_900} emissive={BRAND_TEAL} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

interface SceneProps {
  progress?: number;
  idleDriftDeg?: number;
}

function Scene({ progress, idleDriftDeg = 0 }: SceneProps) {
  const nodes = useNodes();
  const group = useRef<THREE.Group>(null);

  const animated = progress !== undefined;
  const overallProgress = animated ? clamp(progress) : 1;
  const assemblyProgress = animated ? clamp(overallProgress / ASSEMBLY_SPLIT) : 1;
  const assemblyTiltDeg = animated ? -8 + 8 * assemblyProgress : 0;
  const idle = animated ? overallProgress >= ASSEMBLY_SPLIT : true;

  const nodeReveal = nodes.map((_, index) => (animated ? clamp(assemblyProgress * nodes.length - index) : 1));

  useFrame(() => {
    if (!group.current) return;
    const rotateYDeg = idle ? idleDriftDeg : assemblyTiltDeg;
    group.current.rotation.y = (rotateYDeg * Math.PI) / 180;
    group.current.rotation.x = idle ? (idleDriftDeg * 0.5 * Math.PI) / 180 : 0;
  });

  return (
    <group ref={group}>
      <Hub />
      {nodes.map((node, index) => (
        <NodeMesh key={node.slug} node={node} index={index} reveal={nodeReveal[index]} idle={idle} />
      ))}
      <Pulse nodes={nodes} idle={idle} />
    </group>
  );
}

export interface EcosystemDiagram3DProps {
  /** Same interface as EcosystemDiagram's own `progress` -- 0-1 scroll-driven
   * assembly, omit for a fully-assembled idle render. */
  progress?: number;
  /** Degrees, not px like the CSS version's idleDrift -- this prototype has
   * no live scroll wiring yet, so the demo page passes this from a manual
   * slider rather than real scroll position. */
  idleDriftDeg?: number;
}

export function EcosystemDiagram3D({ progress, idleDriftDeg }: EcosystemDiagram3DProps) {
  return (
    // flat -- disables R3F's default ACESFilmicToneMapping (a filmic
    // photographic curve, wrong for exact brand-hex matching -- it was
    // the actual cause of the hub rendering at roughly half its intended
    // brightness, confirmed by pixel-sampling before vs after this fix).
    // NoToneMapping (what `flat` switches to) passes material colors
    // through directly instead.
    <Canvas flat camera={{ position: [0, 0, 7.5], fov: 38 }} dpr={[1, 2]}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={2.6} />
      <directionalLight position={[-3, -2, 2]} intensity={0.7} />
      <Suspense fallback={null}>
        <Scene progress={progress} idleDriftDeg={idleDriftDeg} />
      </Suspense>
    </Canvas>
  );
}
