"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

function Accordion({
  className,
  type = "single",
  collapsible: _collapsible,
  ...props
}: AccordionPrimitive.Root.Props & {
  type?: "single" | "multiple"
  collapsible?: boolean
}) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      data-type={type}
      className={cn("accordion", className)}
      multiple={type === "multiple"}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("accordion-item", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="accordion-trigger-wrap">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn("accordion-trigger focus-ring", className)}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="accordion-trigger-icon accordion-trigger-icon--expand"
          aria-hidden
        />
        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          className="accordion-trigger-icon accordion-trigger-icon--collapse"
          aria-hidden
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="accordion-content"
      {...props}
    >
      <div className={cn("accordion-panel-inner", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
