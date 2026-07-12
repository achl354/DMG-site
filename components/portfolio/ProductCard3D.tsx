"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { DAMP_LAMBDA, sceneBlendProgress } from "@/lib/motion";
import { computeProductTransform } from "@/lib/content/portfolioLayout";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import type { PortfolioScrollProgress } from "@/components/motion/usePortfolioScroll";
import type { ProductStatus } from "@/lib/content/products";
import { ProductCardContent } from "./ProductCardContent";

export interface ProductCard3DProps {
  slug: string;
  name: string;
  wordmarkSvg?: string;
  photoSrc?: string;
  status: ProductStatus;
  scenes: PortfolioScene[];
  progressRef: React.RefObject<PortfolioScrollProgress>;
}

/**
 * One product's persistent presence in the scene -- a flat, real 2D asset
 * (photo or wordmark, via drei's <Html transform>) carried by a Three.js
 * group whose position/scale/rotation is continuously re-targeted every
 * frame from the current scroll progress. No product geometry is invented;
 * only the flat card's position in space and its own CSS opacity/blur move.
 */
export function ProductCard3D({
  slug,
  name,
  wordmarkSvg,
  photoSrc,
  status,
  scenes,
  progressRef,
}: ProductCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const htmlRef = useRef<HTMLDivElement>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const { sceneIndex, sceneProgress } = progressRef.current;
    const currentScene = scenes[sceneIndex];
    const nextScene = scenes[Math.min(scenes.length - 1, sceneIndex + 1)];
    const from = computeProductTransform(slug, currentScene);
    const to = computeProductTransform(slug, nextScene);
    const t = sceneBlendProgress(sceneProgress);

    const targetX = THREE.MathUtils.lerp(from.position.x, to.position.x, t);
    const targetY = THREE.MathUtils.lerp(from.position.y, to.position.y, t);
    const targetZ = THREE.MathUtils.lerp(from.position.z, to.position.z, t);
    const targetScale = THREE.MathUtils.lerp(from.scale, to.scale, t);
    const targetOpacity = THREE.MathUtils.lerp(from.opacity, to.opacity, t);
    const targetBlur = THREE.MathUtils.lerp(from.blur, to.blur, t);
    const targetRotZ = THREE.MathUtils.lerp(from.rotationZ, to.rotationZ, t);

    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, DAMP_LAMBDA, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, targetY, DAMP_LAMBDA, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, DAMP_LAMBDA, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, targetRotZ, DAMP_LAMBDA, delta);
    group.scale.setScalar(THREE.MathUtils.damp(group.scale.x || 1, targetScale, DAMP_LAMBDA, delta));

    if (htmlRef.current) {
      htmlRef.current.style.opacity = String(targetOpacity);
      htmlRef.current.style.filter = targetBlur > 0.05 ? `blur(${targetBlur}px)` : "none";
    }
  });

  return (
    <group ref={groupRef}>
      <Html transform occlude distanceFactor={4} zIndexRange={[10, 0]}>
        <div ref={htmlRef}>
          <ProductCardContent name={name} wordmarkSvg={wordmarkSvg} photoSrc={photoSrc} status={status} />
        </div>
      </Html>
    </group>
  );
}
