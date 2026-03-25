"use client";

import { GallerySection } from "@/components/gallery/GallerySection";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function SelectionSection() {
  return (
    <GallerySection
      id="selection"
      title="Selection"
      description="Checkbox, RadioGroup, Switch, Slider"
    >
      <div className="gallery-grid">
        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Checkbox</h3>
          <div className="gallery-inline">
            <Checkbox id="check1" />
            <Label htmlFor="check1">Accept terms and conditions</Label>
          </div>
          <div className="gallery-inline">
            <Checkbox id="check2" defaultChecked />
            <Label htmlFor="check2">Subscribe to newsletter</Label>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Radio group</h3>
          <RadioGroup defaultValue="option1">
            <div className="gallery-inline">
              <RadioGroupItem value="option1" id="option1" />
              <Label htmlFor="option1">Option 1</Label>
            </div>
            <div className="gallery-inline">
              <RadioGroupItem value="option2" id="option2" />
              <Label htmlFor="option2">Option 2</Label>
            </div>
            <div className="gallery-inline">
              <RadioGroupItem value="option3" id="option3" />
              <Label htmlFor="option3">Option 3</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Switch</h3>
          <div className="gallery-inline">
            <Switch id="switch1" />
            <Label htmlFor="switch1">Enable notifications</Label>
          </div>
          <div className="gallery-inline">
            <Switch id="switch2" defaultChecked />
            <Label htmlFor="switch2">Dark mode</Label>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Slider</h3>
          <div className="gallery-stack">
            <Slider defaultValue={[50]} max={100} step={1} />
            <Slider defaultValue={[25, 75]} max={100} step={1} />
          </div>
        </div>
      </div>
    </GallerySection>
  );
}
