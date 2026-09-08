// Motion primitives, in CSS.
//
// These were framer-motion. On the city hub - our highest commercial-intent
// page - Lighthouse mobile showed 264 KiB of JavaScript downloaded and never
// executed, 1,822ms of script evaluation, and a largest contentful paint of
// 5.3 seconds on an element that is a paragraph of text. The page was waiting
// on an animation library to reveal prose.
//
// The API is unchanged on purpose: eighteen files import these and none of them
// needed editing. FadeIn, Stagger, StaggerItem, MotionLink and the three hover
// helpers all keep their signatures, so the change is contained to this file.
//
// Two deliberate differences from the framer-motion behaviour. Animation runs
// on load rather than on scroll into view, because content parked at opacity 0
// waiting for an observer is invisible to a crawler, to a thumbnail and to
// anyone who lands mid-page. And everything is disabled under
// prefers-reduced-motion, which the previous implementation did not honour.

import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

export const EASE = [0.22, 1, 0.36, 1] as const

type DivProps = Omit<ComponentProps<"div">, "children"> & { children?: ReactNode }
type FadeInProps = DivProps & { delay?: number; duration?: number; viewport?: unknown }

/** Fades and slides an element in on load. */
export function FadeIn({ children, delay = 0, duration = 0.6, viewport: _v, className = "", style, ...rest }: FadeInProps) {
  return (
    <div
      className={`dih-fade ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s`, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}

type StaggerProps = DivProps & { stagger?: number; delayChildren?: number; viewport?: unknown }

/** Reveals StaggerItem children in sequence. */
export function Stagger({ children, stagger = 0.12, delayChildren = 0, viewport: _v, className = "", style, ...rest }: StaggerProps) {
  return (
    <div
      className={`dih-stagger ${className}`}
      style={{ ["--dih-stagger" as string]: `${stagger}s`, ["--dih-delay" as string]: `${delayChildren}s`, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}

type StaggerItemProps = DivProps & { duration?: number }

export function StaggerItem({ children, duration = 0.5, className = "", style, ...rest }: StaggerItemProps) {
  return (
    <div className={`dih-fade ${className}`} style={{ animationDuration: `${duration}s`, ...style }} {...rest}>
      {children}
    </div>
  )
}

type MotionLinkProps = ComponentProps<typeof Link> & { "data-hover"?: string }

/** next/link with a CSS hover behaviour. Kept as a named export so the eighteen
 *  files that spread hoverScale onto it did not have to change. */
export function MotionLink({ className = "", ...rest }: MotionLinkProps) {
  return <Link className={`dih-hover ${className}`} {...rest} />
}

/** Spread onto MotionLink or any element for a subtle hover lift. */
export const hoverLift = { "data-hover": "lift" } as const

/** Spread onto a button or CTA for a subtle hover scale. */
export const hoverScale = { "data-hover": "scale" } as const

/** Subtle rightward shift, for text links. */
export const hoverShift = { "data-hover": "shift" } as const
