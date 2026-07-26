"use client"

/**
 * @author dorianbaffier
 * @description Feature grid with aurora ambient, magnetic 3D tilt, and focus-dim siblings.
 * @version 2.0.0
 * @date 2025-02-20
 * @license MIT
 * @website https://kokonutui.com
 * @github https://github.com/kokonut-labs/kokonutui
 */

import type { LucideIcon } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

const TILT_MAX = 9
const TILT_SPRING = { stiffness: 300, damping: 28 } as const
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const

export interface SpotlightItem {
  icon: LucideIcon
  title: string
  desc: string
  color: string
}

interface CardProps {
  item: SpotlightItem
  dimmed: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}

function Card({ item, dimmed, onHoverStart, onHoverEnd }: CardProps) {
  const Icon = item.icon
  const cardRef = useRef<HTMLDivElement>(null)

  const normX = useMotionValue(0.5)
  const normY = useMotionValue(0.5)

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX])
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX])

  const rotateX = useSpring(rawRotateX, TILT_SPRING)
  const rotateY = useSpring(rawRotateY, TILT_SPRING)
  const glowOpacity = useSpring(0, GLOW_SPRING)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    normX.set((e.clientX - rect.left) / rect.width)
    normY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseEnter = () => {
    glowOpacity.set(1)
    onHoverStart()
  }

  const handleMouseLeave = () => {
    normX.set(0.5)
    normY.set(0.5)
    glowOpacity.set(0)
    onHoverEnd()
  }

  return (
    <motion.div
      animate={{
        scale: dimmed ? 0.96 : 1,
        opacity: dimmed ? 0.5 : 1,
      }}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-6",
        "border-zinc-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}14, transparent 65%)`,
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}2e, transparent 65%)`,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]"
      />

      <div
        className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          background: `${item.color}18`,
          boxShadow: `inset 0 0 0 1px ${item.color}30`,
        }}
      >
        <Icon size={19} strokeWidth={1.9} style={{ color: item.color }} />
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="font-bold text-[15px] text-slate-900 tracking-tight">
          {item.title}
        </h3>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          {item.desc}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}80, transparent)`,
        }}
      />
    </motion.div>
  )
}

Card.displayName = "Card"

export interface SpotlightCardsProps {
  items: SpotlightItem[]
  className?: string
}

export default function SpotlightCards({ items, className }: SpotlightCardsProps) {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null)

  return (
    <div className={cn("relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {items.map((item) => (
        <Card
          dimmed={hoveredTitle !== null && hoveredTitle !== item.title}
          item={item}
          key={item.title}
          onHoverEnd={() => setHoveredTitle(null)}
          onHoverStart={() => setHoveredTitle(item.title)}
        />
      ))}
    </div>
  )
}
