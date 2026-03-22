"use client";

import {
  createColumnHelper,
  type Row,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { TradingBlotterRow } from "./data";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<TradingBlotterRow>();

/** Column `meta` for trading blotter — use on `<TableCell>` when backgrounds must span full cell width. */
export type BlotterColumnMeta = {
  align?: "right";
  /** Background on `<td>` so fills edge-to-edge (not clipped by cell padding). */
  blotterCellBackground?: (row: Row<TradingBlotterRow>) => string;
};

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
    meta: {
      blotterCellBackground: (row) => {
        if (row.getIsSelected()) return "bg-transparent";
        const status = row.getValue("status") as TradingBlotterRow["status"];
        const map: Record<TradingBlotterRow["status"], string> = {
          FILL: "bg-data-status-positive",
          REJ: "bg-data-status-negative",
          WRK: "bg-data-status-warning",
        };
        return map[status] ?? "bg-data-status-neutral";
      },
    } satisfies BlotterColumnMeta,
    cell: ({ row }) => {
      const isSelected = row.getIsSelected();
      return (
        <div
          className={cn(
            "flex h-full w-full items-center font-bold",
            isSelected
              ? "text-data-table-row-fg-selected"
              : "text-primary-foreground"
          )}
        >
          {row.getValue("status")}
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
    meta: {
      blotterCellBackground: (row) => {
        if (row.getIsSelected()) return "bg-transparent";
        const side = row.getValue("side") as TradingBlotterRow["side"];
        const map: Record<TradingBlotterRow["side"], string> = {
          BUY: "bg-data-value-positive/20",
          SELL: "bg-data-value-negative/20",
        };
        return map[side] ?? "bg-data-value-neutral/20";
      },
    } satisfies BlotterColumnMeta,
    cell: ({ row }) => {
      const side = row.getValue("side") as TradingBlotterRow["side"];
      const isSelected = row.getIsSelected();
      const sideText: Record<TradingBlotterRow["side"], string> = {
        BUY: "text-data-value-positive",
        SELL: "text-data-value-negative",
      };
      return (
        <div
          className={cn(
            "flex h-full w-full items-center font-bold",
            isSelected
              ? "text-data-table-row-fg-selected"
              : sideText[side] ?? "text-data-value-neutral"
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
    meta: { align: "right" } satisfies BlotterColumnMeta,
  }),

  columnHelper.accessor("execPrice", {
    header: "Executed Price",
    cell: ({ row }) => (
      <span className="text-data-primary">{row.getValue("execPrice")}</span>
    ),
    meta: { align: "right" } satisfies BlotterColumnMeta,
  }),

  columnHelper.accessor("spotPrice", {
    header: "Spot Price",
    cell: ({ row }) => (
      <span className="text-data-primary">{row.getValue("spotPrice")}</span>
    ),
    meta: { align: "right" } satisfies BlotterColumnMeta,
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
