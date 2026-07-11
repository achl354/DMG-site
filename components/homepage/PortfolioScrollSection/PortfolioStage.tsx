"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useWebglSupport } from "@/components/scroller/useWebglSupport";
import { PortfolioCssStage } from "./PortfolioCssStage";
import type { PortfolioScene } from "@/lib/content/portfolioScenes";
import type { PortfolioScrollProgress } from "@/components/motion/usePortfolioScroll";
import styles from "./PortfolioStage.module.css";

const PortfolioCanvas = dynamic(
  () => import("./PortfolioCanvas").then((mod) => mod.PortfolioCanvas),
  { ssr: false },
);

export interface PortfolioStageProps {
  scenes: PortfolioScene[];
  progressRef: React.RefObject<PortfolioScrollProgress>;
}

/**
 * Right-hand persistent product scene -- real WebGL (React Three Fiber) when
 * supported, the CSS-transform equivalent otherwise. Never leaves the
 * visitor looking at an empty canvas while the R3F bundle loads: the CSS
 * stage renders immediately and only swaps out once WebGL support is
 * confirmed.
 */
export function PortfolioStage({ scenes, progressRef }: PortfolioStageProps) {
  const webglSupported = useWebglSupport();
  const [contextLost, setContextLost] = useState(false);

  const useCanvas = webglSupported === true && !contextLost;

  return (
    <div className={styles.wrapper}>
      {useCanvas ? (
        <PortfolioCanvas scenes={scenes} progressRef={progressRef} onContextLost={() => setContextLost(true)} />
      ) : (
        <PortfolioCssStage scenes={scenes} progressRef={progressRef} />
      )}
    </div>
  );
}
