import * as React from "react";

import { cn } from "@/lib/utils";

const variantClass = {
  default: "alert--default",
  destructive: "alert--destructive",
} as const;

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: keyof typeof variantClass }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn("alert", variantClass[variant], className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("alert-title", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("alert-description", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
