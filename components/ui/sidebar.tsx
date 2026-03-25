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
      className={cn(className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(className)}
      {...props}
    />
  );
}

export { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarFooter, useSidebar };
