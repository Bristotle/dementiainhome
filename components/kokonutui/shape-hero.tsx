"use client";

/**
 * Adapted from "Shape Hero" by @dorianbaffier
 * @license MIT
 * @website https://kokonutui.com
 * @github https://github.com/kokonut-labs/kokonutui
 *
 * Repurposed here with the site's real brand copy, fonts, and CTAs
 * instead of the generic demo content.
 */

import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
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

export interface ShapeHeroProps {
  eyebrow?: string;
  title1?: string;
  title2?: string;
  description?: string;
  compact?: boolean;
}

export default function ShapeHero({
  eyebrow = "In-Home Dementia Care · Nationwide",
  title1 = "Real caregivers.",
  title2 = "Free 72-hour matching.",
  description = "We hand-pick vetted dementia caregivers and send you their video profiles within 72 hours. Free. No obligation. Transparent pricing.",
  compact = false,
}: ShapeHeroProps) {
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.3 + i * 0.15, ease: [0.25, 0.4, 0.25, 1] },
    }),
  };

  return (
    <div className={cn(
      "relative flex w-full items-center justify-center overflow-hidden bg-teal-700",
      compact ? "min-h-[420px] py-20" : "min-h-[88vh]"
    )}>
      <div className="absolute inset-0 bg-linear-to-br from-teal-500/20 via-transparent to-teal-900/40" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape borderRadius={24} className="top-[-10%] left-[-15%]" delay={0.3} gradient="from-teal-300/[0.25]" height={500} rotate={-8} width={300} />
        <ElegantShape borderRadius={20} className="right-[-20%] bottom-[-5%]" delay={0.5} gradient="from-emerald-300/[0.25]" height={200} rotate={15} width={600} />
        <ElegantShape borderRadius={32} className="top-[40%] left-[-5%]" delay={0.4} gradient="from-teal-200/[0.2]" height={300} rotate={24} width={300} />
        <ElegantShape borderRadius={12} className="top-[5%] right-[10%]" delay={0.6} gradient="from-white/[0.15]" height={100} rotate={-20} width={250} />
        <ElegantShape borderRadius={16} className="top-[45%] right-[-10%]" delay={0.7} gradient="from-emerald-200/[0.2]" height={150} rotate={35} width={400} />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            animate="visible" custom={0} initial="hidden" variants={fadeUpVariants}
            className="text-teal-200 text-sm font-semibold uppercase tracking-widest mb-4"
          >
            {eyebrow}
          </motion.p>
          <motion.div animate="visible" custom={1} initial="hidden" variants={fadeUpVariants}>
            <h1
              className="mb-6 font-bold text-white text-4xl sm:text-6xl leading-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {title1}
              <br />
              <span className="text-teal-300">{title2}</span>
            </h1>
          </motion.div>
          <motion.div animate="visible" custom={2} initial="hidden" variants={fadeUpVariants}>
            <p className="mx-auto mb-8 max-w-lg text-slate-100 text-lg leading-relaxed">
              {description}
            </p>
          </motion.div>
          {!compact && (
            <motion.div animate="visible" custom={3} initial="hidden" variants={fadeUpVariants} className="flex flex-wrap gap-3 justify-center">
              <Link href="#get-matched" className="px-8 py-4 rounded-xl bg-white text-teal-700 font-semibold text-base hover:bg-teal-50 transition-colors shadow-lg">
                Get Free Caregiver Profiles &rarr;
              </Link>
              <Link href="/caregivers" className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur text-white font-semibold text-base hover:bg-white/20 transition-colors border border-white/30">
                Meet Our Caregivers &rarr;
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
