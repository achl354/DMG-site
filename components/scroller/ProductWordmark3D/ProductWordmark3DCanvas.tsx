"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ProductWordmark } from "@/components/ui";
import { useElementProgress } from "../useElementProgress";
import { DAMP_LAMBDA } from "@/lib/motion";
import styles from "./ProductWordmark3D.module.css";

export interface ProductWordmark3DCanvasProps {
  name: string;
  svgSrc?: string;
  onContextLost: () => void;
}

/** The real WebGL version -- a single product wordmark as a DOM card
 * positioned in 3D space (drei's <Html transform>), damped rotation only
 * (no bounce), driven by how far the hero has scrolled past, not a pinned
 * track. */
export function ProductWordmark3DCanvas({
  name,
  svgSrc,
  onContextLost,
}: ProductWordmark3DCanvasProps) {
  const { ref, progress } = useElementProgress<HTMLDivElement>();

  return (
    <div ref={ref} className={styles.stage}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 6], fov: 28 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (event) => {
              event.preventDefault();
              onContextLost();
            },
            { once: true },
          );
        }}
      >
        <ambientLight intensity={1.4} />
        <RotatingWordmark name={name} svgSrc={svgSrc} progress={progress} />
      </Canvas>
    </div>
  );
}

function RotatingWordmark({
  name,
  svgSrc,
  progress,
}: {
  name: string;
  svgSrc?: string;
  progress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Large enough swing to actually read as rotation on a flat, wide
    // wordmark card -- a subtle few degrees disappears visually on
    // mostly-2D content with no side faces to show depth against.
    const targetRotY = (progress - 0.5) * 1.3;
    const targetRotX = (0.5 - progress) * 0.4;
    const targetScale = 0.82 + progress * 0.22;
    const targetZ = (progress - 0.5) * -1.2;

    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetRotY, DAMP_LAMBDA, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetRotX, DAMP_LAMBDA, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, DAMP_LAMBDA, delta);

    const nextScale = THREE.MathUtils.damp(group.scale.x || 1, targetScale, DAMP_LAMBDA, delta);
    group.scale.setScalar(nextScale);
  });

  return (
    <group ref={groupRef}>
      <Html transform occlude distanceFactor={4}>
        <div className={styles.card}>
          <ProductWordmark name={name} svgSrc={svgSrc} height={56} />
        </div>
      </Html>
    </group>
  );
}
