"use client"
import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { MotionLink } from "@/components/motion"

export const neonButtonVariants = cva(
  "relative group border text-center rounded-full font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-white/5 hover:bg-white/10 border-teal-300/30 text-white",
        solid: "bg-teal-600 hover:bg-teal-500 text-white border-transparent hover:border-white/40 transition-colors duration-200 shadow-lg",
        ghost: "border-transparent bg-transparent text-teal-600 hover:border-teal-300 hover:bg-teal-50",
      },
      size: {
        default: "px-7 py-3 text-sm",
        sm: "px-4 py-2 text-xs",
        lg: "px-10 py-4 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

const HOVER_TRANSITION = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }

/** The glowing top/bottom hairlines that appear on hover - the signature "neon" effect. */
export function NeonGlowEdges({ neon = true }: { neon?: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px w-3/4 mx-auto opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 bg-gradient-to-r from-transparent via-teal-300 to-transparent hidden",
          neon && "block"
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 -bottom-px h-px w-3/4 mx-auto opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-40 bg-gradient-to-r from-transparent via-teal-300 to-transparent hidden",
          neon && "block"
        )}
      />
    </>
  )
}

export interface NeonButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof neonButtonVariants> {
  neon?: boolean
  children?: React.ReactNode
}

/** A button with a hover-triggered neon glow, for in-page actions (submit, toggle, etc). */
export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, neon = true, size, variant, children, whileHover, whileTap, transition, ...props }, ref) => (
    <motion.button
      ref={ref}
      className={cn(neonButtonVariants({ variant, size }), className)}
      whileHover={whileHover ?? { scale: 1.03 }}
      whileTap={whileTap ?? { scale: 0.97 }}
      transition={transition ?? HOVER_TRANSITION}
      {...props}
    >
      {children}
      <NeonGlowEdges neon={neon} />
    </motion.button>
  )
)
NeonButton.displayName = "NeonButton"

export interface NeonLinkButtonProps
  extends Omit<React.ComponentProps<typeof MotionLink>, "className" | "children">,
    VariantProps<typeof neonButtonVariants> {
  neon?: boolean
  className?: string
  children?: React.ReactNode
}

/** Same visual treatment as NeonButton, routed through next/link for page navigation. */
export const NeonLinkButton = React.forwardRef<HTMLAnchorElement, NeonLinkButtonProps>(
  ({ className, neon = true, size, variant, children, whileHover, whileTap, transition, ...props }, ref) => (
    <MotionLink
      ref={ref}
      className={cn(neonButtonVariants({ variant, size }), className)}
      whileHover={whileHover ?? { scale: 1.03 }}
      whileTap={whileTap ?? { scale: 0.97 }}
      transition={transition ?? HOVER_TRANSITION}
      {...props}
    >
      {children}
      <NeonGlowEdges neon={neon} />
    </MotionLink>
  )
)
NeonLinkButton.displayName = "NeonLinkButton"
