"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="button-group"
    role="group"
    className={cn("inline-flex [&>*]:rounded-none [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md [&>*:not(:first-child)]:border-l-0 [&>*]:active:bg-press [&>*]:active:text-press-foreground", className)}
    {...props}
  />
));
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
