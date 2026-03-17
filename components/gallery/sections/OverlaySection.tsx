"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { GallerySection } from "@/components/gallery/GallerySection";

export function OverlaySection() {
  return (
    <GallerySection
      id="overlay"
      title="Overlay"
      description="Dialog, Drawer, Sheet, Popover, Tooltip, Dropdown, HoverCard, Context Menu"
    >
      <TooltipProvider>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Dialog</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog. It can contain any content.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Drawer</h3>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer Title</DrawerTitle>
                  <DrawerDescription>
                    This is a drawer that slides up from the bottom.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button>Submit</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Sheet</h3>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet Title</SheetTitle>
                  <SheetDescription>
                    This is a sheet that slides in from the right.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Popover</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid gap-2">
                  <h4 className="font-medium">Popover content</h4>
                  <p className="text-sm text-muted-foreground">
                    This appears when you click the trigger.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Tooltip</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover for tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Dropdown</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open Dropdown</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">HoverCard</h3>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline">Hover for card</Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Hover card</h4>
                  <p className="text-sm text-muted-foreground">
                    This appears when you hover over the trigger.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Context Menu (right-click)</h3>
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div className="flex h-24 w-full items-center justify-center rounded-md border border-dashed">
                  <span className="text-sm text-muted-foreground">
                    Right-click here
                  </span>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Copy</ContextMenuItem>
                <ContextMenuItem>Paste</ContextMenuItem>
                <ContextMenuItem>Cut</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </div>
      </TooltipProvider>
    </GallerySection>
  );
}
