import { GallerySection } from "@/components/gallery/GallerySection";

export function TypographySection() {
  return (
    <GallerySection
      id="typography"
      title="Typography"
      description="Typography scale using design tokens"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Headings</h3>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold leading-tight">
              Heading 1
            </h1>
            <h2 className="text-2xl font-semibold leading-tight">
              Heading 2
            </h2>
            <h3 className="text-xl font-semibold">
              Heading 3
            </h3>
            <h4 className="text-lg font-medium">
              Heading 4
            </h4>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Body text</h3>
          <div className="space-y-2">
            <p className="text-base leading-normal">
              Base body text at 1rem with normal line height.
            </p>
            <p className="text-sm leading-relaxed">
              Small text at 0.875rem with relaxed line height.
            </p>
            <p className="text-xs">
              Extra small text at 0.75rem.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Weights</h3>
          <div className="space-y-2">
            <p className="font-normal">Normal (400)</p>
            <p className="font-medium">Medium (500)</p>
            <p className="font-semibold">Semibold (600)</p>
            <p className="font-bold">Bold (700)</p>
          </div>
        </div>
      </div>
    </GallerySection>
  );
}
