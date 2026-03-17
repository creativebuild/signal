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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Checkbox</h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="check1" />
            <Label htmlFor="check1">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="check2" defaultChecked />
            <Label htmlFor="check2">Subscribe to newsletter</Label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Radio group</h3>
          <RadioGroup defaultValue="option1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" id="option1" />
              <Label htmlFor="option1">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" id="option2" />
              <Label htmlFor="option2">Option 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option3" id="option3" />
              <Label htmlFor="option3">Option 3</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Switch</h3>
          <div className="flex items-center space-x-2">
            <Switch id="switch1" />
            <Label htmlFor="switch1">Enable notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="switch2" defaultChecked />
            <Label htmlFor="switch2">Dark mode</Label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Slider</h3>
          <div className="space-y-2">
            <Slider defaultValue={[50]} max={100} step={1} />
            <Slider defaultValue={[25, 75]} max={100} step={1} />
          </div>
        </div>
      </div>
    </GallerySection>
  );
}
