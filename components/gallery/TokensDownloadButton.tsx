"use client";

import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

async function downloadFromApi(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) return;
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(objectUrl);
}

export function TokensDownloadButton() {
  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Download design tokens"
                aria-haspopup="menu"
              >
                <DownloadIcon className="gallery-icon" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Download design tokens</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="gallery-tokens-dropdown">
          <DropdownMenuItem
            onClick={() => downloadFromApi("/api/tokens", "variables-pro.json")}
          >
            Variables Pro — variables-pro.json
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              downloadFromApi("/api/tokens/figma?mode=light", "light.json")
            }
          >
            Figma Variables — light.json
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              downloadFromApi("/api/tokens/figma?mode=dark", "dark.json")
            }
          >
            Figma Variables — dark.json
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
