import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GallerySectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function GallerySection({
  id,
  title,
  description,
  children,
  className,
}: GallerySectionProps) {
  return (
    <section id={id} className={cn("gallery-section", className)}>
      <div className="gallery-section-inner">
        <div className="gallery-section-header">
          <h2 className="gallery-section-title">{title}</h2>
          {description && (
            <p className="gallery-section-desc">{description}</p>
          )}
        </div>
        <div className="gallery-section-body">{children}</div>
      </div>
    </section>
  );
}
