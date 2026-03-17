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
        "w-full min-w-0 rounded-[var(--radius-control)] border border-input bg-transparent py-1 transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:dark:aria-invalid:border-destructive/50 md:dark:aria-invalid:ring-destructive/40",
        "h-[var(--control-height-md)] px-[var(--control-px-sm)] text-sm",
        "file:h-6 file:text-sm",
        "dark:bg-input/30 dark:disabled:bg-input/80",
        className
      )}
      {...props}
    />
  );
}

export { Input };
