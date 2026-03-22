import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-[var(--radius-control)] border border-input bg-control-input-bg py-1 transition-colors focus-ring file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:bg-control-input-bg-disabled disabled:opacity-50 aria-invalid:border-destructive/80 aria-invalid:ring-3 aria-invalid:ring-destructive/30",
        "h-[var(--control-height-md)] px-[var(--control-px-sm)] text-sm",
        "file:h-6 file:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Input };
