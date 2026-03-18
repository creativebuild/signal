"use client";

import { ArrowRightIcon, PlusIcon } from "lucide-react";

import { GallerySection } from "@/components/gallery/GallerySection";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ButtonsSection() {
  return (
    <GallerySection
      id="buttons"
      title="Buttons"
      description="Button variants, sizes, and button groups"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Variants</h3>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Sizes</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="xs">Extra Small</Button>
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="secondary">Default</Button>
            <Button variant="secondary" size="lg">Large</Button>
            <Button variant="secondary" size="xl">Extra Large</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Icon buttons</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="icon-xs" aria-label="Add">
              <PlusIcon />
            </Button>
            <Button variant="secondary" size="icon-sm" aria-label="Add">
              <PlusIcon />
            </Button>
            <Button variant="secondary" size="icon" aria-label="Add">
              <PlusIcon />
            </Button>
            <Button variant="secondary" size="icon-lg" aria-label="Add">
              <PlusIcon />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">With icon</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">
              Next
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Button group</h3>
          <ButtonGroup>
            <Button variant="outline">One</Button>
            <Button variant="outline">Two</Button>
            <Button variant="outline">Three</Button>
          </ButtonGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Toggle</h3>
          <div className="flex flex-wrap gap-2">
            <Toggle>Toggle</Toggle>
            <Toggle variant="outline">Outline</Toggle>
          </div>
          <ToggleGroup type="single" className="justify-start">
            <ToggleGroupItem value="a">Option A</ToggleGroupItem>
            <ToggleGroupItem value="b">Option B</ToggleGroupItem>
            <ToggleGroupItem value="c">Option C</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </GallerySection>
  );
}
