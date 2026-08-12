"use client";

import { useState } from "react";
import { EcosystemDiagram3D } from "@/components/homepage/HeroSection/EcosystemDiagram3D";
import styles from "./page.module.css";

/**
 * EXPERIMENTAL, not linked from any nav -- a side-by-side comparison
 * scratch page for the EcosystemDiagram3D prototype (see that file's own
 * header comment). Not intended to ship; delete this route once the
 * comparison has been judged one way or the other.
 *
 * Manual sliders, not real scroll wiring -- this prototype doesn't hook
 * into HeroSection.tsx's actual pinned-scroll progress calculation, so
 * these stand in for it: deterministic, screenshot-able exact values for
 * verification, rather than needing a real scroll gesture to reach a
 * specific assembly/idle-drift state.
 */
export default function Hero3DExperimentPage() {
  const [progress, setProgress] = useState(1);
  const [idleDriftDeg, setIdleDriftDeg] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#FAFAF7",
        color: "#16211E",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ padding: "24px 32px 0" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          Hero ecosystem diagram -- WebGL prototype
        </h1>
        <p style={{ color: "#48534F", maxWidth: "640px" }}>
          Experimental React Three Fiber build for comparison against the shipped CSS-3D version.
          Not linked anywhere in the real site.
        </p>
        <div className={styles.controls}>
          <label>
            Assembly progress: {progress.toFixed(2)}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
            />
          </label>
          <label>
            Idle drift (deg): {idleDriftDeg}
            <input
              type="range"
              min={-10}
              max={10}
              step={1}
              value={idleDriftDeg}
              onChange={(event) => setIdleDriftDeg(Number(event.target.value))}
            />
          </label>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: "480px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 40rem/640px -- matches EcosystemDiagram.module.css's .stageOuter
            width, so this canvas occupies the same on-page footprint the
            CSS version does, for a fair side-by-side comparison. */}
        <div style={{ width: "40rem", aspectRatio: "4 / 4.4", position: "relative", overflow: "hidden" }}>
          <EcosystemDiagram3D progress={progress} idleDriftDeg={idleDriftDeg} />
        </div>
      </div>
    </div>
  );
}
