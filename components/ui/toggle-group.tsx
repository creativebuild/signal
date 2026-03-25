"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

type ToggleVariantKey = "default" | "outline"
type ToggleSizeKey = "default" | "sm" | "lg"

const ToggleGroupContext = React.createContext<{
  variant?: ToggleVariantKey
  size?: ToggleSizeKey
  spacing?: number
  orientation?: "horizontal" | "vertical"
}>({
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
}: ToggleGroupPrimitive.Props & {
    variant?: ToggleVariantKey
    size?: ToggleSizeKey
    spacing?: number
    orientation?: "horizontal" | "vertical"
    type?: "single" | "multiple"
  }) {
  return (
    <ToggleGroupContext.Provider
      value={{ variant, size, spacing, orientation }}
    >
      <ToggleGroupPrimitive
        multiple={type === "multiple"}
        data-slot="toggle-group"
        data-variant={variant}
        data-type={type}
        data-size={size}
        data-spacing={spacing}
        data-orientation={orientation}
        style={{ "--spacing-mult": String(spacing) } as React.CSSProperties}
        className={cn(className)}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive>
    </ToggleGroupContext.Provider>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & {
    variant?: ToggleVariantKey
    size?: ToggleSizeKey
  }) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
