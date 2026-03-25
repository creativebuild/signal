import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import type { ClassValue } from "clsx"

import { cn } from "@/lib/utils"

const variantClass = {
  default: "badge--default",
  secondary: "badge--secondary",
  destructive: "badge--destructive",
  outline: "badge--outline",
  ghost: "badge--ghost",
  link: "badge--link",
  success: "badge--success",
  warning: "badge--warning",
  info: "badge--info",
} as const

function badgeVariants({
  variant = "default",
  className,
}: {
  variant?: keyof typeof variantClass
  className?: ClassValue
} = {}) {
  return cn("badge", variantClass[variant], className)
}

function Badge({
  className,
  variant = "default",
  asChild,
  render,
  children,
  ...props
}: useRender.ComponentProps<"span"> & {
  variant?: keyof typeof variantClass
  asChild?: boolean
}) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
        children,
      },
      props
    ),
    render: asChild && React.isValidElement(children) ? children : render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
