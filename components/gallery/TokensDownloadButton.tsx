"use client";

import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TokensDownloadButton() {
  const handleDownload = async () => {
    const res = await fetch("/api/tokens");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "variables-pro.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            aria-label="Download tokens for Variables Pro"
          >
            <DownloadIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Tokens for Variables Pro</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
