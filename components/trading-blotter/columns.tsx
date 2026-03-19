"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { TradingBlotterRow } from "./data";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<TradingBlotterRow>();

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <div className="flex w-10 min-w-10 items-center justify-start pr-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div
        className="flex w-10 min-w-10 items-center justify-start pr-2"
        data-in-selected-row={row.getIsSelected() || undefined}
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as TradingBlotterRow["status"];
      const isSelected = row.getIsSelected();
      const statusClasses: Record<TradingBlotterRow["status"], string> = {
        FILL: "bg-data-status-positive",
        REJ: "bg-data-status-negative",
        WRK: "bg-data-status-warning",
      };
      const baseClasses =
        "flex h-full w-full items-center px-[calc(var(--spacing-data-table-cell-px)/2)] py-data-table-cell-py font-bold";
      const selectedClasses = "bg-transparent text-data-table-row-fg-selected";
      const unselectedClasses = "text-primary-foreground";
      return (
        <div
          className={cn(
            baseClasses,
            isSelected ? selectedClasses : unselectedClasses,
            !isSelected && (statusClasses[status] ?? "bg-data-status-neutral")
          )}
        >
          {status}
        </div>
      );
    },
  }),

  columnHelper.accessor("product", {
    header: "Product",
    cell: ({ row }) => (
      <span className="text-data-category">{row.getValue("product")}</span>
    ),
  }),

  columnHelper.accessor("ccy", {
    id: "ccy",
    header: "CCY1CCY2",
    cell: ({ row }) => (
      <span className="text-data-currency">{row.getValue("ccy")}</span>
    ),
  }),

  columnHelper.accessor("side", {
    header: "Side",
    cell: ({ row }) => {
      const side = row.getValue("side") as TradingBlotterRow["side"];
      const isSelected = row.getIsSelected();
      const sideClasses: Record<TradingBlotterRow["side"], string> = {
        BUY: "text-data-value-positive bg-data-value-positive/20",
        SELL: "text-data-value-negative bg-data-value-negative/20",
      };
      return (
        <div
          className={cn(
            "flex h-full w-full items-center px-[calc(var(--spacing-data-table-cell-px)/2)] py-data-table-cell-py font-bold",
            isSelected ? "bg-transparent text-data-table-row-fg-selected" : sideClasses[side] ?? "text-data-value-neutral bg-data-value-neutral/20"
          )}
        >
          {side}
        </div>
      );
    },
  }),

  columnHelper.accessor("execAmount", {
    header: "Executed Amount",
    cell: ({ row }) => (
      <span className="text-data-primary">{row.getValue("execAmount")}</span>
    ),
    meta: { align: "right" },
  }),

  columnHelper.accessor("execPrice", {
    header: "Executed Price",
    cell: ({ row }) => (
      <span className="text-data-primary">{row.getValue("execPrice")}</span>
    ),
    meta: { align: "right" },
  }),

  columnHelper.accessor("spotPrice", {
    header: "Spot Price",
    cell: ({ row }) => (
      <span className="text-data-primary">{row.getValue("spotPrice")}</span>
    ),
    meta: { align: "right" },
  }),

  columnHelper.accessor("fwdPoints", {
    header: "Forward Points",
    cell: ({ row }) => (
      <span className="text-data-secondary">{row.getValue("fwdPoints")}</span>
    ),
  }),

  columnHelper.accessor("valueDate", {
    header: "Value Date",
    cell: ({ row }) => (
      <span className="text-data-datetime">{row.getValue("valueDate")}</span>
    ),
  }),

  columnHelper.accessor("modifiedDate", {
    header: "Modified Date",
    cell: ({ row }) => (
      <span className="text-data-datetime">{row.getValue("modifiedDate")}</span>
    ),
  }),

  columnHelper.accessor("modifiedBy", {
    header: "Modified By",
    cell: ({ row }) => (
      <span className="text-data-entity">{row.getValue("modifiedBy")}</span>
    ),
  }),

  columnHelper.accessor("ref", {
    header: "Ref",
    cell: ({ row }) => (
      <span className="text-data-secondary">{row.getValue("ref")}</span>
    ),
  }),

  columnHelper.accessor("lifecycle", {
    header: "Lifecycle",
    cell: ({ row }) => {
      const lifecycle = row.getValue("lifecycle") as string;
      const isComplete = lifecycle === "Complete";
      const isPending = lifecycle === "Pending";
      return (
        <span
          className={cn(
            isComplete && "text-data-status-positive",
            isPending && "text-data-status-warning",
            !isComplete && !isPending && "text-data-status-neutral"
          )}
        >
          {lifecycle}
        </span>
      );
    },
  }),
];
