"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const SidebarContext = React.createContext<{ open?: boolean }>({});

function SidebarProvider({
  children,
  open = true,
}: {
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <SidebarContext.Provider value={{ open }}>
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  const context = React.useContext(SidebarContext);
  return context ?? { open: true };
}

function Sidebar({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex h-screen flex-col border-r bg-card",
        "w-[var(--sidebar-width)]",
        className
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex h-[var(--control-height-md)] items-center px-[var(--control-px-sm)] border-b gap-2", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-auto p-[var(--control-px-sm)]", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("border-t p-[var(--control-px-sm)]", className)}
      {...props}
    />
  );
}

export { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarFooter, useSidebar };
