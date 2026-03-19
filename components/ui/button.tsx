"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all focus-ring select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80 active:bg-press active:text-press-foreground",
        outline:
          "border-border bg-transparent hover:bg-accent hover:text-accent-foreground active:!bg-press active:!text-press-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:border-input dark:bg-transparent dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-press active:text-press-foreground aria-expanded:bg-secondary-hover",
        ghost:
          "hover:bg-muted hover:text-foreground active:!bg-press active:!text-press-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 active:bg-destructive active:text-destructive-foreground focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        success:
          "bg-success/10 text-success hover:bg-success/20 active:bg-success active:text-success-foreground focus-visible:border-success/40 focus-visible:ring-success/20 dark:bg-success/20 dark:hover:bg-success/30 dark:focus-visible:ring-success/40",
        warning:
          "bg-warning/10 text-warning hover:bg-warning/20 active:bg-warning active:text-warning-foreground focus-visible:border-warning/40 focus-visible:ring-warning/20 dark:bg-warning/20 dark:hover:bg-warning/30 dark:focus-visible:ring-warning/40",
        info:
          "bg-info/10 text-info hover:bg-info/20 active:bg-info active:text-info-foreground focus-visible:border-info/40 focus-visible:ring-info/20 dark:bg-info/20 dark:hover:bg-info/30 dark:focus-visible:ring-info/40",
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
