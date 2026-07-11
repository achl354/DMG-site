"use client";

import { Canvas } from "@react-three/fiber";
import { ProductCard3D } from "@/components/portfolio/ProductCard3D";
import { PRODUCT_WORDMARKS } from "@/lib/content/assets";
import { getAllProducts } from "@/lib/content/products";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import type { PortfolioScrollProgress } from "@/components/motion/usePortfolioScroll";

const EASIMOVE_SPU_PHOTO = "/products/easimove-spu/scroll/01-hero.png";

export interface PortfolioCanvasProps {
  scenes: PortfolioScene[];
  progressRef: React.RefObject<PortfolioScrollProgress>;
  onContextLost: () => void;
}

/** The real WebGL portfolio scene -- one persistent set of product cards. */
export function PortfolioCanvas({ scenes, progressRef, onContextLost }: PortfolioCanvasProps) {
  const products = getAllProducts();

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 32 }}
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
      <ambientLight intensity={1.5} />
      {products.map((product) => (
        <ProductCard3D
          key={product.slug}
          slug={product.slug}
          name={product.name}
          wordmarkSvg={PRODUCT_WORDMARKS[product.slug]}
          photoSrc={product.slug === "easimove-spu" ? EASIMOVE_SPU_PHOTO : undefined}
          status={product.status}
          scenes={scenes}
          progressRef={progressRef}
        />
      ))}
    </Canvas>
  );
}
