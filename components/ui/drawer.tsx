"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "@/lib/utils"

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close

type OverlayRef = React.ElementRef<typeof DrawerPrimitive.Overlay>
type OverlayProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>

const DrawerOverlay = React.forwardRef<OverlayRef, OverlayProps>(function DrawerOverlay(props, ref) {
  const { className, ...rest } = props
  return <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/40", className)} {...rest} />
})

type ContentRef = React.ElementRef<typeof DrawerPrimitive.Content>
type ContentProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>

const DrawerContent = React.forwardRef<ContentRef, ContentProps>(function DrawerContent(props, ref) {
  const { className, children, ...rest } = props
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn("fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950", className)}
        {...rest}
      >
        <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
})

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

type TitleRef = React.ElementRef<typeof DrawerPrimitive.Title>
type TitleProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>

const DrawerTitle = React.forwardRef<TitleRef, TitleProps>(function DrawerTitle(props, ref) {
  const { className, ...rest } = props
  return <DrawerPrimitive.Title ref={ref} className={cn("font-semibold text-lg leading-none tracking-tight", className)} {...rest} />
})

type DescriptionRef = React.ElementRef<typeof DrawerPrimitive.Description>
type DescriptionProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>

const DrawerDescription = React.forwardRef<DescriptionRef, DescriptionProps>(function DrawerDescription(props, ref) {
  const { className, ...rest } = props
  return <DrawerPrimitive.Description ref={ref} className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)} {...rest} />
})

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
