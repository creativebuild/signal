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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Card</h3>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This is the card content area. It can contain any content.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Card footer</p>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Avatar sizes</h3>
          <div className="flex items-center gap-4">
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

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Skeleton</h3>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>

        <div className="col-span-full space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Data Table</h3>
          <div className="rounded-md border">
            <Table>
              <TableCaption>A sample data table</TableCaption>
              <TableHeader>
                <TableRow className="h-[var(--data-table-row-height-sm)]">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.email} className="h-[var(--data-table-row-height-sm)]">
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="col-span-full space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Trading Blotter</h3>
          <TradingBlotter />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Aspect ratio</h3>
          <AspectRatio ratio={16 / 9} className="rounded-md bg-muted">
            <div className="flex size-full items-center justify-center text-muted-foreground">
              16:9
            </div>
          </AspectRatio>
        </div>
      </div>
    </GallerySection>
  );
}
