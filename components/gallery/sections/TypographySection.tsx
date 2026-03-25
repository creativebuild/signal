import { GallerySection } from "@/components/gallery/GallerySection";

export function TypographySection() {
  return (
    <GallerySection
      id="typography"
      title="Typography"
      description="Typography scale using design tokens"
    >
      <div className="gallery-grid">
        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Headings</h3>
          <div className="gallery-stack">
            <h1 className="gallery-type-h1">Heading 1</h1>
            <h2 className="gallery-type-h2">Heading 2</h2>
            <h3 className="gallery-type-h3">Heading 3</h3>
            <h4 className="gallery-type-h4">Heading 4</h4>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Body text</h3>
          <div className="gallery-stack">
            <p className="gallery-type-body">
              Base body text at 1rem with normal line height.
            </p>
            <p className="gallery-type-body-sm">
              Small text at 0.875rem with relaxed line height.
            </p>
            <p className="gallery-type-body-xs">Extra small text at 0.75rem.</p>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Weights</h3>
          <div className="gallery-stack">
            <p className="gallery-type-normal">Normal (400)</p>
            <p className="gallery-type-medium">Medium (500)</p>
            <p className="gallery-type-semibold">Semibold (600)</p>
            <p className="gallery-type-bold">Bold (700)</p>
          </div>
        </div>
      </div>
    </GallerySection>
  );
}
