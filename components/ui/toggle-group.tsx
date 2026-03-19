"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal",
})

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  type = "single",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
    type?: "single" | "multiple"
  }) {
  return (
    <ToggleGroupPrimitive
      multiple={type === "multiple"}
      data-slot="toggle-group"
      data-variant={variant}
      data-type={type}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-[var(--radius-control)] overflow-hidden data-[spacing=0]:data-[variant=outline]:shadow-xs data-vertical:flex-col data-vertical:items-stretch",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-row items-center gap-[var(--gap)] min-w-0 min-h-0",
          spacing === 0 && "[&>*]:rounded-none [&>*:first-child]:rounded-l-[var(--radius-control)] [&>*:last-child]:rounded-r-[var(--radius-control)]",
          spacing === 0 && orientation === "vertical" && "[&>*]:rounded-none [&>*:first-child]:rounded-t-[var(--radius-control)] [&>*:last-child]:rounded-b-[var(--radius-control)]",
          orientation === "vertical" && "flex-col"
        )}
      >
        <ToggleGroupContext.Provider
          value={{ variant, size, spacing, orientation }}
        >
          {children}
        </ToggleGroupContext.Provider>
      </div>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "shrink-0 focus:z-10 focus-visible:z-10 data-[state=on]:bg-muted group-data-[spacing=0]/toggle-group:shadow-none group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:data-[variant=outline]:[&:not(:first-child)]:border-l-0 group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:data-[variant=outline]:[&:not(:first-child)]:border-t-0 group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        className
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
