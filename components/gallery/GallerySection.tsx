import { cn } from "@/lib/utils";

interface GallerySectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
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
    <section
      id={id}
      className={cn("scroll-mt-24 border-b border-border py-12", className)}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="sticky top-16 z-10 -mx-4 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
