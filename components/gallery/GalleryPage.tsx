"use client";

import { ThemeToggle } from "@/components/gallery/ThemeToggle";
import { TokensDownloadButton } from "@/components/gallery/TokensDownloadButton";
import { ButtonsSection } from "@/components/gallery/sections/ButtonsSection";
import { TypographySection } from "@/components/gallery/sections/TypographySection";
import { FormControlsSection } from "@/components/gallery/sections/FormControlsSection";
import { FeedbackSection } from "@/components/gallery/sections/FeedbackSection";
import { DataDisplaySection } from "@/components/gallery/sections/DataDisplaySection";
import { ChartsSection } from "@/components/gallery/sections/ChartsSection";
import { NavigationSection } from "@/components/gallery/sections/NavigationSection";
import { LayoutSection } from "@/components/gallery/sections/LayoutSection";
import { OverlaySection } from "@/components/gallery/sections/OverlaySection";
import { SelectionSection } from "@/components/gallery/sections/SelectionSection";
import { MediaSection } from "@/components/gallery/sections/MediaSection";

export function GalleryPage() {
  return (
    <main className="gallery-page">
      <header className="gallery-page-header">
        <div className="gallery-page-header-inner">
          <div>
            <h1 className="gallery-page-title">Design System</h1>
            <p className="gallery-page-subtitle">
              Token-driven shadcn/ui component gallery
            </p>
          </div>
          <div className="gallery-page-actions">
            <TokensDownloadButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="gallery-sections">
        <ButtonsSection />
        <TypographySection />
        <FormControlsSection />
        <FeedbackSection />
        <DataDisplaySection />
        <ChartsSection />
        <NavigationSection />
        <LayoutSection />
        <OverlaySection />
        <SelectionSection />
        <MediaSection />
      </div>
    </main>
  );
}
