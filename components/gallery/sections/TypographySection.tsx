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
            <h1 className="text-[var(--font-size-3xl)] font-bold leading-[var(--line-height-tight)]">
              Heading 1
            </h1>
            <h2 className="text-[var(--font-size-2xl)] font-semibold leading-[var(--line-height-tight)]">
              Heading 2
            </h2>
            <h3 className="text-[var(--font-size-xl)] font-semibold">
              Heading 3
            </h3>
            <h4 className="text-[var(--font-size-lg)] font-medium">
              Heading 4
            </h4>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Body text</h3>
          <div className="space-y-2">
            <p className="text-[var(--font-size-base)] leading-[var(--line-height-normal)]">
              Base body text at 1rem with normal line height.
            </p>
            <p className="text-[var(--font-size-sm)] leading-[var(--line-height-relaxed)]">
              Small text at 0.875rem with relaxed line height.
            </p>
            <p className="text-[var(--font-size-xs)]">
              Extra small text at 0.75rem.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Weights</h3>
          <div className="space-y-2">
            <p style={{ fontWeight: "var(--font-weight-normal)" }}>Normal (400)</p>
            <p style={{ fontWeight: "var(--font-weight-medium)" }}>Medium (500)</p>
            <p style={{ fontWeight: "var(--font-weight-semibold)" }}>Semibold (600)</p>
            <p style={{ fontWeight: "var(--font-weight-bold)" }}>Bold (700)</p>
          </div>
        </div>
      </div>
    </GallerySection>
  );
}
