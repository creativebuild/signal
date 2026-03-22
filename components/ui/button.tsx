"use client"

import { Button as ButtonPrimitive } from "@base-ui/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 appearance-none items-center justify-center rounded-[var(--radius-control)] border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all focus-ring select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive/80 aria-invalid:ring-3 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80 active:bg-press active:text-press-foreground",
        outline:
          "border-input bg-transparent hover:bg-accent hover:text-accent-foreground active:!bg-press active:!text-press-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-press active:text-press-foreground aria-expanded:bg-secondary-hover",
        ghost:
          "hover:bg-muted hover:text-foreground active:!bg-press active:!text-press-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive-subtle text-destructive hover:bg-destructive-subtle-hover active:bg-destructive active:text-destructive-foreground focus-visible:border-destructive/40 focus-visible:ring-destructive/30",
        success:
          "bg-success-subtle text-success hover:bg-success-subtle-hover active:bg-success active:text-success-foreground focus-visible:border-success/40 focus-visible:ring-success/30",
        warning:
          "bg-warning-subtle text-warning hover:bg-warning-subtle-hover active:bg-warning active:text-warning-foreground focus-visible:border-warning/40 focus-visible:ring-warning/30",
        info:
          "bg-info-subtle text-info hover:bg-info-subtle-hover active:bg-info active:text-info-foreground focus-visible:border-info/40 focus-visible:ring-info/30",
        link: "text-link underline-offset-4 hover:underline active:bg-press/10 active:text-press",
      },
      size: {
        sm: "h-[var(--control-height-sm)] px-[var(--control-px-sm)] text-xs gap-[var(--control-gap)]",
        default: "h-[var(--control-height-md)] px-[var(--control-px-md)] text-sm gap-[var(--control-gap)]",
        lg: "h-[var(--control-height-lg)] px-[var(--control-px-lg)] text-base gap-[var(--control-gap)]",
        icon: "size-[var(--control-height-md)]",
        "icon-sm": "size-[var(--control-height-sm)]",
        "icon-lg": "size-[var(--control-height-lg)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
