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
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-[var(--shadow-xs)] transition-colors duration-150 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-ring aria-invalid:border-destructive/80 aria-invalid:ring-3 aria-invalid:ring-destructive/30 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-selection data-unchecked:bg-switch-track-unchecked data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block shrink-0 rounded-full ring-0 transition-[transform,background-color] duration-150 ease-out",
          "group-data-[size=default]/switch:size-4 group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)]",
          "group-data-[size=sm]/switch:size-3 group-data-[size=sm]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)]",
          "group-data-[checked]/switch:bg-selection-foreground group-data-[unchecked]/switch:bg-switch-thumb-unchecked",
          "group-data-[unchecked]/switch:group-active/switch:bg-press"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
