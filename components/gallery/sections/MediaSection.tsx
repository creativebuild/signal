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
      <div className="gallery-grid">
        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Progress</h3>
          <div className="gallery-stack-loose">
            <Progress value={0} />
            <Progress value={33} />
            <Progress value={66} />
            <Progress value={100} />
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Separator</h3>
          <div className="gallery-stack-loose">
            <div>
              <p className="gallery-text-sm gallery-text-muted">Content above</p>
              <Separator className="gallery-separator-my" />
              <p className="gallery-text-sm gallery-text-muted">Content below</p>
            </div>
            <div className="gallery-separator-vertical-row">
              <span className="gallery-text-sm">Item 1</span>
              <Separator orientation="vertical" />
              <span className="gallery-text-sm">Item 2</span>
              <Separator orientation="vertical" />
              <span className="gallery-text-sm">Item 3</span>
            </div>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">ScrollArea</h3>
          <ScrollArea className="gallery-scroll-demo">
            <div className="gallery-scroll-demo-inner">
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i} className="gallery-text-sm">
                  Item {i + 1}
                </p>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Carousel</h3>
          <Carousel className="gallery-carousel" opts={{ loop: true }}>
            <CarouselContent>
              {Array.from({ length: 3 }).map((_, i) => (
                <CarouselItem key={i}>
                  <div className="gallery-carousel-slide">
                    <span className="gallery-carousel-slide-label">
                      {i + 1}
                    </span>
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
