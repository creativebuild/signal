"use client";

import { ThemeToggle } from "@/components/gallery/ThemeToggle";
import { TokensDownloadButton } from "@/components/gallery/TokensDownloadButton";
import { ButtonsSection } from "@/components/gallery/sections/ButtonsSection";
import { TypographySection } from "@/components/gallery/sections/TypographySection";
import { FormControlsSection } from "@/components/gallery/sections/FormControlsSection";
import { FeedbackSection } from "@/components/gallery/sections/FeedbackSection";
import { DataDisplaySection } from "@/components/gallery/sections/DataDisplaySection";
import { NavigationSection } from "@/components/gallery/sections/NavigationSection";
import { LayoutSection } from "@/components/gallery/sections/LayoutSection";
import { OverlaySection } from "@/components/gallery/sections/OverlaySection";
import { SelectionSection } from "@/components/gallery/sections/SelectionSection";
import { MediaSection } from "@/components/gallery/sections/MediaSection";

export function GalleryPage() {
  return (
    <main className="min-h-screen bg-background" style={{ ["--header-height" as string]: "7rem" }}>
      <header className="sticky top-0 z-50 flex h-[var(--header-height)] shrink-0 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-full max-w-6xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Design System</h1>
            <p className="text-sm text-muted-foreground">
              Token-driven shadcn/ui component gallery
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TokensDownloadButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="sections">
        <ButtonsSection />
        <TypographySection />
        <FormControlsSection />
        <FeedbackSection />
        <DataDisplaySection />
        <NavigationSection />
        <LayoutSection />
        <OverlaySection />
        <SelectionSection />
        <MediaSection />
      </div>
    </main>
  );
}
