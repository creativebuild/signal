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
      <div className="gallery-grid">
        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Variants</h3>
          <div className="gallery-row">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="info">Info</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Sizes</h3>
          <div className="gallery-row gallery-row--center">
            <Button variant="secondary" size="sm">
              Small
            </Button>
            <Button variant="secondary">Medium</Button>
            <Button variant="secondary" size="lg">
              Large
            </Button>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Icon buttons</h3>
          <div className="gallery-row gallery-row--center">
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

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">With icon</h3>
          <div className="gallery-row">
            <Button variant="secondary">
              Next
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Button group</h3>
          <ButtonGroup>
            <Button variant="outline">One</Button>
            <Button variant="outline">Two</Button>
            <Button variant="outline">Three</Button>
          </ButtonGroup>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Toggle</h3>
          <div className="gallery-row">
            <Toggle>Toggle</Toggle>
            <Toggle variant="outline">Outline</Toggle>
          </div>
          <ToggleGroup type="single" className="gallery-toggle-group-start">
            <ToggleGroupItem value="a">Option A</ToggleGroupItem>
            <ToggleGroupItem value="b">Option B</ToggleGroupItem>
            <ToggleGroupItem value="c">Option C</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </GallerySection>
  );
}
