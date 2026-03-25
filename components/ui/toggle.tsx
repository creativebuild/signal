"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import type { ClassValue } from "clsx"

import { cn } from "@/lib/utils"

const variantClass = {
  default: "toggle--default",
  outline: "toggle--outline",
} as const

const sizeClass = {
  default: "toggle--default-size",
  sm: "toggle--sm",
  lg: "toggle--lg",
} as const

function toggleVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: keyof typeof variantClass
  size?: keyof typeof sizeClass
  className?: ClassValue
} = {}) {
  return cn(
    "toggle focus-ring",
    variantClass[variant],
    sizeClass[size],
    className
  )
}

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & {
  variant?: keyof typeof variantClass
  size?: keyof typeof sizeClass
}) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
