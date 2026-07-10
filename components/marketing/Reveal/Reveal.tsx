"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/motion";

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Fade-and-rise scroll reveal -- eased, no spring/bounce, per the brand's
 * own motion rule. Fires on mount too (via whileInView), so it also serves
 * as the hero's load-in animation.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
