"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Html, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { ProductWordmark } from "@/components/ui";
import { EyebrowHeading } from "@/components/ui/EyebrowHeading/EyebrowHeading";
import { useScrollProgress } from "./useScrollProgress";
import type { ProductWithAssets } from "@/lib/content/products";
import { DAMP_LAMBDA } from "@/lib/motion";
import styles from "./ScrollerCanvas.module.css";

export interface ScrollerCanvasProps {
  products: ProductWithAssets[];
  onContextLost: () => void;
}

/**
 * The real WebGL layered depth-card gallery -- native-scroll driven (via
 * useScrollProgress, the same hook ScrollerFallback uses), damped
 * interpolation only (no spring/bounce), real product wordmarks rendered
 * as DOM content positioned in true 3D space via drei's <Html transform>
 * rather than approximated with rasterised textures or fake rotatable
 * models (no real product photography exists to texture).
 */
export function ScrollerCanvas({ products, onContextLost }: ScrollerCanvasProps) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  return (
    <div className={styles.wrapper}>
      <EyebrowHeading
        eyebrow="EasiSystem™ range"
        heading="A closer look at the range"
        body="Nine product lines covering standing, transfer, lifting and repositioning -- built to work together, not just sit side by side."
        align="center"
        className={styles.heading}
      />

      <div ref={ref} className={styles.track}>
        <div className={styles.sticky}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
            camera={{ position: [0, 0, 9], fov: 32 }}
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
            <PerformanceMonitor />
            <AdaptiveDpr />
            <ambientLight intensity={1.4} />
            {products.map((product, index) => (
              <DepthCard3D
                key={product.slug}
                product={product}
                index={index}
                total={products.length}
                progress={progress}
              />
            ))}
          </Canvas>
        </div>
      </div>
    </div>
  );
}

function DepthCard3D({
  product,
  index,
  total,
  progress,
}: {
  product: ProductWithAssets;
  index: number;
  total: number;
  progress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const center = (index + 0.5) / total;
  const { viewport } = useThree();

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Normalized to "card widths" -- see ScrollerFallback.tsx for why.
    const distance = (progress - center) * total;
    const abs = Math.min(Math.abs(distance), 1);

    // Fixed world-unit offsets swing cards past the visible frustum on a
    // narrow/portrait canvas -- scale by the actual visible viewport width
    // instead (capped at the values verified on a standard desktop canvas).
    const maxOffsetX = Math.min(4.4, viewport.width * 0.6);
    const maxOffsetZ = Math.min(5, viewport.width * 0.68);

    const targetX = distance * maxOffsetX;
    const targetZ = -abs * maxOffsetZ;
    const targetRotY = clamp(distance * -0.24, -0.1, 0.1);
    const targetScale = 1 - clamp(abs * 0.35, 0, 0.35);
    const targetOpacity = 1 - clamp(abs * 1.8, 0, 0.75);

    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, DAMP_LAMBDA, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, DAMP_LAMBDA, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetRotY, DAMP_LAMBDA, delta);

    const nextScale = THREE.MathUtils.damp(group.scale.x || 1, targetScale, DAMP_LAMBDA, delta);
    group.scale.setScalar(nextScale);

    if (cardRef.current) {
      cardRef.current.style.opacity = String(targetOpacity);
    }
  });

  return (
    <group ref={groupRef}>
      <Html transform occlude distanceFactor={6} zIndexRange={[total - index, 0]}>
        <div ref={cardRef} className={styles.card}>
          <ProductWordmark name={product.name} svgSrc={product.wordmarkSvg} height={26} />
          <span className={styles.cardCategory}>{product.category}</span>
        </div>
      </Html>
    </group>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
