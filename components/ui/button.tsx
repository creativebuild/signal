"use client"

import { Button as ButtonPrimitive } from "@base-ui/react"
import type { ClassValue } from "clsx"

import { cn } from "@/lib/utils"

const variantClass = {
  default: "btn--default",
  outline: "btn--outline",
  secondary: "btn--secondary",
  ghost: "btn--ghost",
  destructive: "btn--destructive",
  success: "btn--success",
  warning: "btn--warning",
  info: "btn--info",
  link: "btn--link",
} as const

const sizeClass = {
  sm: "btn--sm",
  default: "btn--default-size",
  lg: "btn--lg",
  icon: "btn--icon",
  "icon-sm": "btn--icon-sm",
  "icon-lg": "btn--icon-lg",
} as const

function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: keyof typeof variantClass
  size?: keyof typeof sizeClass
  className?: ClassValue
} = {}) {
  return cn(
    "btn focus-ring",
    variantClass[variant],
    sizeClass[size],
    className
  )
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & {
  variant?: keyof typeof variantClass
  size?: keyof typeof sizeClass
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
