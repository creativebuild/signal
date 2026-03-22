"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns, type BlotterColumnMeta } from "./columns";
import { tradingBlotterData } from "./data";

export function TradingBlotter() {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({
    "blotter-3": true,
  });

  const table = useReactTable({
    data: tradingBlotterData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: (row) => row.id,
  });

  return (
    <div className="w-full max-h-[70vh] overflow-y-auto overflow-x-hidden rounded-md border">
      <div className="overflow-x-auto overflow-y-hidden min-w-full">
        <table className="w-full caption-bottom text-data-table font-data-table whitespace-nowrap">
          <TableHeader className="[&_tr]:border-b-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="h-data-table-header border-b-0 py-0 bg-data-table-header text-data-table-header-foreground"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-data-table-header text-data-table-header font-data-table-header px-data-table-cell-px py-data-table-cell-py",
                      (header.column.columnDef.meta as BlotterColumnMeta | undefined)
                        ?.align === "right" && "text-right"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-data-table-row-sm border-b-0 hover:bg-data-table-row-hover data-[state=selected]:bg-selection data-[state=selected]:text-selection-foreground data-[state=selected]:[&_td:first-child]:text-foreground data-[state=selected]:[&_td:not(:first-child)_*]:text-selection-foreground"
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | BlotterColumnMeta
                      | undefined;
                    return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "h-full px-data-table-cell-px py-data-table-cell-py",
                        meta?.blotterCellBackground?.(cell.row),
                        meta?.align === "right" && "text-right"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-data-table-row-sm border-b-0">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 px-data-table-cell-px py-data-table-cell-py text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
