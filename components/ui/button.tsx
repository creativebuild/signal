import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-[var(--button-height-xs)] px-[var(--button-px-xs)] text-[length:var(--button-font-size-sm)] gap-[var(--button-gap)]",
        sm: "h-[var(--button-height-sm)] px-[var(--button-px-sm)] text-[length:var(--button-font-size-sm)] gap-[var(--button-gap)]",
        default:
          "h-[var(--button-height-md)] px-[var(--button-px-md)] text-[length:var(--button-font-size-md)] gap-[var(--button-gap)]",
        lg: "h-[var(--button-height-lg)] px-[var(--button-px-lg)] text-[length:var(--button-font-size-lg)] gap-[var(--button-gap)]",
        xl: "h-[var(--button-height-xl)] px-[var(--button-px-xl)] text-[length:var(--button-font-size-lg)] gap-[var(--button-gap)]",
        icon: "size-[var(--button-height-md)]",
        "icon-xs": "size-[var(--button-height-xs)]",
        "icon-sm": "size-[var(--button-height-sm)]",
        "icon-lg": "size-[var(--button-height-lg)]",
        "icon-xl": "size-[var(--button-height-xl)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
