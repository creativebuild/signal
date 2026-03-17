"use client";

import { GallerySection } from "@/components/gallery/GallerySection";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function MediaSection() {
  return (
    <GallerySection
      id="media"
      title="Media"
      description="Progress, Separator, ScrollArea, Carousel"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
          <div className="space-y-4">
            <Progress value={0} />
            <Progress value={33} />
            <Progress value={66} />
            <Progress value={100} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Separator</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Content above</p>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">Content below</p>
            </div>
            <div className="flex h-5 items-center space-x-4">
              <span className="text-sm">Item 1</span>
              <Separator orientation="vertical" />
              <span className="text-sm">Item 2</span>
              <Separator orientation="vertical" />
              <span className="text-sm">Item 3</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">ScrollArea</h3>
          <ScrollArea className="h-32 w-48 rounded-md border">
            <div className="space-y-2 p-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i} className="text-sm">
                  Item {i + 1}
                </p>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Carousel</h3>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {Array.from({ length: 3 }).map((_, i) => (
                <CarouselItem key={i}>
                  <div className="flex aspect-square items-center justify-center rounded-md border bg-muted">
                    <span className="text-4xl font-semibold">{i + 1}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </GallerySection>
  );
}
