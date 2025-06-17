import { type ColumnDef, flexRender, getCoreRowModel, type Row, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderExpandedContent?: (row: Row<TData>) => React.ReactNode;
}

export function CollapsibleDataTable<TData, TValue>({
  columns,
  data,
  renderExpandedContent = () => <div>No expanded content</div>,
}: DataTableProps<TData, TValue>) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Toggle function for clicking a row
  function toggleRow(id: string) {
    setExpandedRowId(current => (current === id ? null : id));
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <React.Fragment key={row.id}>
                {/* Main clickable row */}
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => toggleRow(row.id)}
                  className="cursor-pointer">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>

                {/* Collapsible row content */}
                <TableRow>
                  <TableCell colSpan={columns.length} className="p-0">
                    <Collapsible
                      open={expandedRowId === row.id}
                      onOpenChange={isOpen => setExpandedRowId(isOpen ? row.id : null)}>
                      <CollapsibleContent>
                        {/* Put here whatever you want to show inside expanded row */}
                        {renderExpandedContent(row)}
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
