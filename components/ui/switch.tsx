"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-[var(--shadow-xs)] transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-ring aria-invalid:border-destructive/80 aria-invalid:ring-3 aria-invalid:ring-destructive/30 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-selection data-unchecked:bg-switch-track-unchecked data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full ring-0 transition-[transform,background-color,box-shadow] group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-checked/switch:bg-selection-foreground group-data-unchecked/switch:bg-switch-thumb-unchecked group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 group-data-unchecked/switch:group-active/switch:bg-press group-data-unchecked/switch:group-active/switch:ring-2 group-data-unchecked/switch:group-active/switch:ring-press/30"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
