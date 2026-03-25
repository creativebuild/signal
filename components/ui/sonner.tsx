"use client";

import { Toaster as Sonner } from "sonner";

import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ className, ...props }: ToasterProps) => {
  return (
    <Sonner
      className={cn("toaster", className)}
      toastOptions={{
        classNames: {
          toast: "toast",
          description: "description",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
