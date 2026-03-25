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
    <div className="blotter-shell">
      <div className="blotter-scroll-x">
        <table className="data-table">
          <TableHeader className="data-table-header">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="data-table-header-row"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "data-table-head-cell",
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
                  className="data-table-body-row"
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | BlotterColumnMeta
                      | undefined;
                    return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "data-table-cell",
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
              <TableRow className="data-table-body-row">
                <TableCell
                  colSpan={columns.length}
                  className="data-table-empty-cell"
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
