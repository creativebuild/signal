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
      <div className="gallery-grid">
        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Sidebar</h3>
          <div className="gallery-demo-frame">
            <SidebarProvider>
              <Sidebar>
                <SidebarHeader>
                  <span className="gallery-demo-sidebar-title">Sidebar</span>
                </SidebarHeader>
                <SidebarContent>
                  <nav className="gallery-demo-nav">
                    <a href="#" className="gallery-demo-nav-link">
                      Item 1
                    </a>
                    <a href="#" className="gallery-demo-nav-link">
                      Item 2
                    </a>
                    <a href="#" className="gallery-demo-nav-link">
                      Item 3
                    </a>
                  </nav>
                </SidebarContent>
                <SidebarFooter>
                  <span className="gallery-demo-sidebar-footer">Footer</span>
                </SidebarFooter>
              </Sidebar>
            </SidebarProvider>
          </div>
        </div>

        <div className="gallery-sample gallery-col-span-2">
          <h3 className="gallery-sample-title">Resizable panels</h3>
          <div className="gallery-demo-frame">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="gallery-resizable-cell gallery-resizable-cell--a">
                  <span className="gallery-resizable-label">Panel 1</span>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="gallery-resizable-cell gallery-resizable-cell--b">
                  <span className="gallery-resizable-label">Panel 2</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </GallerySection>
  );
}
