"use client";

/**
 * Adapted from "Shape Hero" by @dorianbaffier
 * @license MIT
 * @website https://kokonutui.com
 * @github https://github.com/kokonut-labs/kokonutui
 *
 * Extracted as a standalone background layer so it can sit behind
 * existing hero content instead of replacing it wholesale.
 */

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.15]",
  borderRadius = 16,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  borderRadius?: number;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0, rotate }}
      className={cn("absolute", className)}
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        className="relative"
        style={{ width, height }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div
          className={cn(
            "absolute inset-0",
            "bg-linear-to-r to-transparent",
            gradient,
            "backdrop-blur-[1px]",
            "ring-1 ring-white/[0.15]",
            "shadow-[0_2px_16px_-2px_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]",
            "after:rounded-[inherit]"
          )}
          style={{ borderRadius }}
        />
      </motion.div>
    </motion.div>
  );
}

/** Full set of shapes — for tall/primary heroes (the homepage). */
export function ShapeBackgroundFull({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute inset-0 bg-linear-to-br from-teal-500/20 via-transparent to-teal-900/40" />
      <ElegantShape borderRadius={24} className="top-[-10%] left-[-15%]" delay={0.3} gradient="from-teal-300/[0.25]" height={500} rotate={-8} width={300} />
      <ElegantShape borderRadius={20} className="right-[-20%] bottom-[-5%]" delay={0.5} gradient="from-emerald-300/[0.25]" height={200} rotate={15} width={600} />
      <ElegantShape borderRadius={32} className="top-[40%] left-[-5%]" delay={0.4} gradient="from-teal-200/[0.2]" height={300} rotate={24} width={300} />
      <ElegantShape borderRadius={12} className="top-[5%] right-[10%]" delay={0.6} gradient="from-white/[0.15]" height={100} rotate={-20} width={250} />
      <ElegantShape borderRadius={16} className="top-[45%] right-[-10%]" delay={0.7} gradient="from-emerald-200/[0.2]" height={150} rotate={35} width={400} />
    </div>
  );
}

/** Richer set of shapes + texture — for secondary page-header sections. */
export function ShapeBackgroundCompact({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute inset-0 bg-soft-wash" />
      <div className="absolute inset-0 bg-linear-to-br from-teal-500/[0.08] via-transparent to-teal-700/[0.12]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(13,148,136,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <ElegantShape borderRadius={24} className="top-[-25%] left-[-8%]" delay={0.15} gradient="from-teal-300/[0.28]" height={260} rotate={-12} width={300} />
      <ElegantShape borderRadius={20} className="bottom-[-30%] right-[-8%]" delay={0.3} gradient="from-teal-200/[0.22]" height={220} rotate={16} width={360} />
      <ElegantShape borderRadius={18} className="top-[10%] right-[8%]" delay={0.45} gradient="from-amber-300/[0.18]" height={90} rotate={-18} width={180} />
      <ElegantShape borderRadius={16} className="bottom-[5%] left-[15%]" delay={0.6} gradient="from-emerald-300/[0.2]" height={110} rotate={22} width={200} />
    </div>
  );
}
