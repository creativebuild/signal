"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import type { ClassValue } from "clsx"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("tabs", className)}
      {...props}
    />
  )
}

const listVariantClass = {
  default: "",
  line: "tabs-list--line",
} as const

function tabsListVariants({
  variant = "default",
  className,
}: {
  variant?: keyof typeof listVariantClass
  className?: ClassValue
} = {}) {
  return cn("tabs-list", listVariantClass[variant], className)
}

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & { variant?: keyof typeof listVariantClass }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn("tabs-trigger focus-ring", className)}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("tabs-content focus-ring", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
