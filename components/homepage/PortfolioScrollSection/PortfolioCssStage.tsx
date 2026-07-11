"use client";

import { useEffect, useRef } from "react";
import { damp, DAMP_LAMBDA } from "@/lib/motion";
import { computeProductTransform, type Vec3 } from "@/lib/content/portfolioLayout";
import { PRODUCT_WORDMARKS } from "@/lib/content/assets";
import { getAllProducts } from "@/lib/content/products";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import type { PortfolioScrollProgress } from "@/components/motion/usePortfolioScroll";
import { ProductCardContent } from "@/components/portfolio/ProductCardContent";
import styles from "./PortfolioCssStage.module.css";

const EASIMOVE_SPU_PHOTO = "/products/easimove-spu/scroll/01-hero.png";
const WORLD_TO_PX = 90;

export interface PortfolioCssStageProps {
  scenes: PortfolioScene[];
  progressRef: React.RefObject<PortfolioScrollProgress>;
}

interface CardState {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  blur: number;
  rotationZ: number;
}

function lerpVec3(from: Vec3, to: Vec3, t: number): Vec3 {
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    z: from.z + (to.z - from.z) * t,
  };
}

/**
 * CSS-transform equivalent of the WebGL portfolio scene, for browsers/devices
 * without WebGL -- same data-driven positions from computeProductTransform,
 * just applied to plain DOM transforms via requestAnimationFrame instead of
 * useFrame. Not pixel-identical to the R3F camera projection, but the same
 * "cards drift, recede and dim" language.
 */
export function PortfolioCssStage({ scenes, progressRef }: PortfolioCssStageProps) {
  const products = getAllProducts();
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const stateRefs = useRef<Record<string, CardState>>({});

  useEffect(() => {
    let frame = requestAnimationFrame(function update(time) {
      const prevTime = (update as unknown as { _t?: number })._t ?? time;
      const dt = Math.min(0.05, (time - prevTime) / 1000);
      (update as unknown as { _t?: number })._t = time;

      const { sceneIndex, sceneProgress } = progressRef.current;
      const currentScene = scenes[sceneIndex];
      const nextScene = scenes[Math.min(scenes.length - 1, sceneIndex + 1)];

      for (const product of products) {
        const slug = product.slug;
        const from = computeProductTransform(slug, currentScene);
        const to = computeProductTransform(slug, nextScene);
        const t = sceneProgress;

        const targetPos = lerpVec3(from.position, to.position, t);
        const targetScale = from.scale + (to.scale - from.scale) * t;
        const targetOpacity = from.opacity + (to.opacity - from.opacity) * t;
        const targetBlur = from.blur + (to.blur - from.blur) * t;
        const targetRotationZ = from.rotationZ + (to.rotationZ - from.rotationZ) * t;

        const prevState: CardState = stateRefs.current[slug] ?? {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          scale: targetScale,
          opacity: targetOpacity,
          blur: targetBlur,
          rotationZ: targetRotationZ,
        };

        const nextState: CardState = {
          x: damp(prevState.x, targetPos.x, DAMP_LAMBDA, dt),
          y: damp(prevState.y, targetPos.y, DAMP_LAMBDA, dt),
          z: damp(prevState.z, targetPos.z, DAMP_LAMBDA, dt),
          scale: damp(prevState.scale, targetScale, DAMP_LAMBDA, dt),
          opacity: damp(prevState.opacity, targetOpacity, DAMP_LAMBDA, dt),
          blur: damp(prevState.blur, targetBlur, DAMP_LAMBDA, dt),
          rotationZ: damp(prevState.rotationZ, targetRotationZ, DAMP_LAMBDA, dt),
        };
        stateRefs.current[slug] = nextState;

        const node = nodeRefs.current[slug];
        if (node) {
          const px = nextState.x * WORLD_TO_PX;
          const py = -nextState.y * WORLD_TO_PX;
          const pz = nextState.z * WORLD_TO_PX;
          node.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) rotateZ(${nextState.rotationZ}rad) scale(${nextState.scale})`;
          node.style.opacity = String(nextState.opacity);
          node.style.filter = nextState.blur > 0.05 ? `blur(${nextState.blur}px)` : "none";
        }
      }

      frame = requestAnimationFrame(update);
    });

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- products/scenes are static content, not reactive state
  }, []);

  return (
    <div className={styles.stage}>
      {products.map((product) => (
        <div
          key={product.slug}
          ref={(node) => {
            nodeRefs.current[product.slug] = node;
          }}
          className={styles.card}
        >
          <ProductCardContent
            name={product.name}
            wordmarkSvg={PRODUCT_WORDMARKS[product.slug]}
            photoSrc={product.slug === "easimove-spu" ? EASIMOVE_SPU_PHOTO : undefined}
            status={product.status}
          />
        </div>
      ))}
    </div>
  );
}
