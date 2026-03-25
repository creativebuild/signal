"use client";

import { GallerySection } from "@/components/gallery/GallerySection";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { TradingBlotter } from "@/components/trading-blotter";

const tableData = [
  { name: "Alice", email: "alice@example.com", role: "Admin" },
  { name: "Bob", email: "bob@example.com", role: "User" },
  { name: "Carol", email: "carol@example.com", role: "User" },
];

export function DataDisplaySection() {
  return (
    <GallerySection
      id="data-display"
      title="Data Display"
      description="Table, Card, Avatar, Skeleton, Data Table, AspectRatio"
    >
      <div className="gallery-grid">
        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Card</h3>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="gallery-text-sm">
                This is the card content area. It can contain any content.
              </p>
            </CardContent>
            <CardFooter>
              <p className="gallery-card-footer-muted">Card footer</p>
            </CardFooter>
          </Card>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Avatar sizes</h3>
          <div className="gallery-avatar-row">
            <Avatar size="sm">
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar size="default">
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Skeleton</h3>
          <div className="gallery-stack">
            <Skeleton style={{ height: "1rem", width: "250px" }} />
            <Skeleton style={{ height: "1rem", width: "200px" }} />
            <Skeleton style={{ height: "5rem", width: "100%" }} />
          </div>
        </div>

        <div className="gallery-sample gallery-col-full">
          <h3 className="gallery-sample-title">Data Table</h3>
          <div className="gallery-bordered">
            <Table className="data-table">
              <TableCaption>A sample data table</TableCaption>
              <TableHeader className="data-table-header">
                <TableRow className="data-table-header-row">
                  <TableHead className="data-table-head-cell">Name</TableHead>
                  <TableHead className="data-table-head-cell">Email</TableHead>
                  <TableHead className="data-table-head-cell">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.email} className="data-table-body-row">
                    <TableCell className="data-table-cell">{row.name}</TableCell>
                    <TableCell className="data-table-cell">{row.email}</TableCell>
                    <TableCell className="data-table-cell">{row.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="gallery-sample gallery-col-full">
          <h3 className="gallery-sample-title">Trading Blotter</h3>
          <TradingBlotter />
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Aspect ratio</h3>
          <AspectRatio ratio={16 / 9} className="gallery-aspect-muted">
            <div className="gallery-aspect-inner">16:9</div>
          </AspectRatio>
        </div>
      </div>
    </GallerySection>
  );
}
