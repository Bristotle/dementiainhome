"use client"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { MotionLink } from "@/components/motion"

export const neonButtonVariants = cva(
  "relative group border text-center rounded-full font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-white/5 hover:bg-white/10 border-teal-300/30 text-white",
        solid: "bg-teal-700 hover:bg-teal-800 text-white border-transparent hover:border-white/40 transition-colors duration-200 shadow-lg",
        ghost: "border-transparent bg-transparent text-teal-700 hover:border-teal-300 hover:bg-teal-50",
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
  extends Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof neonButtonVariants> {
  neon?: boolean
  children?: React.ReactNode
}

/** A button with a hover-triggered neon glow, for in-page actions (submit, toggle, etc). */
export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  // Hover is a CSS data attribute now, matching NeonLinkButton below. This one
  // was missed when the library came out, which kept framer-motion on the
  // homepage: HomeView imports this button.
  ({ className, neon = true, size, variant, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(neonButtonVariants({ variant, size }), className)}
      data-hover="scale"
      {...props}
    >
      {children}
      <NeonGlowEdges neon={neon} />
    </button>
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
  // Hover is a CSS data attribute now rather than framer-motion props. See
  // components/motion.tsx for why the library came out.
  ({ className, neon = true, size, variant, children, ...props }, ref) => (
    <MotionLink
      ref={ref}
      className={cn(neonButtonVariants({ variant, size }), className)}
      data-hover="scale"
      {...props}
    >
      {children}
      <NeonGlowEdges neon={neon} />
    </MotionLink>
  )
)
NeonLinkButton.displayName = "NeonLinkButton"
