"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Database,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortAccessor?: (item: T) => any;
  className?: string;
  hidden?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  width: string;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => React.ReactNode;
  expandedContent?: (item: T) => React.ReactNode;
  itemsPerPage?: number;
  onClickView?: (item: T) => React.ReactNode;
  onClickNavigate?: (item: T) => void;
}

export default function DynamicTable<T>({
  data,
  columns,
  actions,
  expandedContent,
  onClickView,
  onClickNavigate,
  itemsPerPage = 10,
}: DynamicTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<Column<T> | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) =>
          String(item?.[key as keyof T] ?? "")
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = sortColumn.sortAccessor
          ? sortColumn.sortAccessor(a)
          : a?.[sortColumn.accessor as keyof T];
        const bValue = sortColumn.sortAccessor
          ? sortColumn.sortAccessor(b)
          : b?.[sortColumn.accessor as keyof T];

        if (aValue === bValue) return 0;
        if (aValue == null) return sortDirection === "asc" ? -1 : 1;
        if (bValue == null) return sortDirection === "asc" ? 1 : -1;

        if (aValue instanceof Date && bValue instanceof Date) {
          return sortDirection === "asc"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortDirection === "asc"
          ? aValue < bValue
            ? -1
            : 1
          : bValue < aValue
          ? -1
          : 1;
      });
    }

    return result;
  }, [data, filters, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: Column<T>) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleFilter = (column: keyof T, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleRowClick = (
    event: React.MouseEvent<HTMLTableRowElement>,
    item: T
  ) => {
    // Check if the clicked element is within the actions column
    const isActionColumn = (event.target as HTMLElement).closest(
      ".actions-column"
    );
    if (!isActionColumn && onClickNavigate) {
      onClickNavigate(item);
    }
  };

  // New function to render empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
      <Database className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No data found
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Try adjusting your filters or add some data.
      </p>
    </div>
  );

  const renderCellContent = (item: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }
    const value = item?.[column.accessor as keyof T];
    return value != null ? value : "-";
  };

  return (
    <>
      <Table className="border rounded-t-lg">
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            {columns.map(
              (column, index) =>
                !column.hidden && (
                  <TableHead
                    key={index}
                    className={`font-semibold text-gray-600 border-b border-r ${column.className}`}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(column)}
                          className="ml-2"
                        >
                          {sortColumn === column ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableHead>
                )
            )}
            {actions && (
              <TableHead className="text-right font-semibold text-gray-600 border-b">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, rowIndex) => (
              <Popover
                key={rowIndex}
                open={openPopoverId === `row-${rowIndex}`}
                onOpenChange={(isOpen) =>
                  setOpenPopoverId(isOpen ? `row-${rowIndex}` : null)
                }
              >
                <PopoverTrigger asChild>
                  <TableRow
                    className={`hover:bg-primary/10 bg-primary/5 ${
                      rowIndex !== paginatedData.length - 1 ? "border-b" : ""
                    } cursor-pointer`}
                    onClick={(event) => handleRowClick(event, item)}
                  >
                    {columns.map(
                      (column, colIndex) =>
                        !column.hidden && (
                          <TableCell
                            key={colIndex}
                            className={`border-r ${column.className}`}
                            style={{ width: column.width }}
                          >
                            {renderCellContent(item, column)}
                          </TableCell>
                        )
                    )}
                    {actions && (
                      <TableCell className="text-right actions-column">
                        <div className="flex justify-end space-x-2">
                          {actions(item)}
                          {expandedContent && (
                            <Collapsible className="md:hidden w-full">
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="w-full flex flex-col items-start gap-2 mt-2">
                                {expandedContent(item)}
                              </CollapsibleContent>
                            </Collapsible>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                </PopoverTrigger>
                {onClickView && (
                  <PopoverContent className="w-auto p-0">
                    {onClickView(item)}
                  </PopoverContent>
                )}
              </Popover>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                {renderEmptyState()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {paginatedData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-background border-t  sm:px-6">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAndSortedData.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {filteredAndSortedData.length}
              </span>{" "}
              results
            </p>
          </div>
          <div className="flex justify-between sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mr-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
