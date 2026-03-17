"use client";

import { GallerySection } from "@/components/gallery/GallerySection";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function LayoutSection() {
  return (
    <GallerySection
      id="layout"
      title="Layout"
      description="Sidebar and Resizable panels"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Sidebar</h3>
          <div className="h-64 overflow-hidden rounded-lg border">
            <SidebarProvider>
              <Sidebar>
                <SidebarHeader>
                  <span className="text-sm font-medium">Sidebar</span>
                </SidebarHeader>
                <SidebarContent>
                  <nav className="space-y-1">
                    <a
                      href="#"
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      Item 1
                    </a>
                    <a
                      href="#"
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      Item 2
                    </a>
                    <a
                      href="#"
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      Item 3
                    </a>
                  </nav>
                </SidebarContent>
                <SidebarFooter>
                  <span className="text-xs text-muted-foreground">Footer</span>
                </SidebarFooter>
              </Sidebar>
            </SidebarProvider>
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Resizable panels</h3>
          <div className="h-64 overflow-hidden rounded-lg border">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="flex h-full items-center justify-center bg-muted/50 p-4">
                  <span className="text-sm text-muted-foreground">Panel 1</span>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="flex h-full items-center justify-center bg-muted/30 p-4">
                  <span className="text-sm text-muted-foreground">Panel 2</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </GallerySection>
  );
}
