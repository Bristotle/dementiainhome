"use client"
import { motion, type HTMLMotionProps, type Variants } from "framer-motion"
import Link from "next/link"

export const EASE = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

type FadeInProps = HTMLMotionProps<"div"> & { delay?: number; duration?: number }

/** Fades + slides an element in once it scrolls into view. */
export function FadeIn({ children, delay = 0, duration = 0.6, viewport, ...rest }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px", ...viewport }}
      variants={fadeUp}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = HTMLMotionProps<"div"> & { stagger?: number; delayChildren?: number }

/** Wraps a group of StaggerItem children and reveals them in sequence on scroll. */
export function Stagger({ children, stagger = 0.12, delayChildren = 0, viewport, ...rest }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px", ...viewport }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren } } }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

type StaggerItemProps = HTMLMotionProps<"div"> & { duration?: number }

export function StaggerItem({ children, duration = 0.5, ...rest }: StaggerItemProps) {
  return (
    <motion.div variants={fadeUp} transition={{ duration, ease: EASE }} {...rest}>
      {children}
    </motion.div>
  )
}

/** next/link with motion props (whileHover, whileTap, etc.) available. */
export const MotionLink = motion.create(Link)

/** Spread onto any motion.* element for a subtle hover lift. */
export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2, ease: EASE } },
  whileTap: { y: -1, scale: 0.98, transition: { duration: 0.1 } },
}

/** Spread onto any motion.* element for a subtle hover scale - best for buttons/CTAs. */
export const hoverScale = {
  whileHover: { scale: 1.03, transition: { duration: 0.2, ease: EASE } },
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
}

/** Subtle hover for text links - small rightward shift. */
export const hoverShift = {
  whileHover: { x: 4, transition: { duration: 0.2, ease: EASE } },
}
