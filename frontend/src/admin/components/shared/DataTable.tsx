import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import type { PaginationMeta } from "../../types";

export interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { _id: string }>({
  columns,
  data,
  isLoading,
  pagination,
  onPageChange,
  emptyMessage = "لا توجد بيانات",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <Table dir="rtl">
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`text-slate-400 font-medium text-right ${
                    column.className || ""
                  }`}
                  dir="rtl"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-slate-800">
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <Skeleton className="h-6 w-full bg-slate-800" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-xl border border-slate-800 p-12 text-center">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <Table dir="rtl">
          <TableHeader>
            <TableRow className="border-slate-800 bg-slate-800/50 hover:bg-slate-800/50">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`text-slate-400 font-medium text-right ${
                    column.className || ""
                  }`}
                  dir="rtl"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item._id}
                className="border-slate-800 hover:bg-slate-800/30"
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={`text-white ${column.className || ""}`}
                    dir="rtl"
                  >
                    {column.cell(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between" dir="rtl">
          <p className="text-sm text-slate-400" dir="rtl">
            عرض {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} من{" "}
            {pagination.total}
          </p>
          <div className="flex items-center gap-1" dir="rtl">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-700 bg-slate-800 hover:bg-slate-700"
              onClick={() => onPageChange?.(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-700 bg-slate-800 hover:bg-slate-700"
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm text-slate-400" dir="rtl">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-700 bg-slate-800 hover:bg-slate-700"
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-700 bg-slate-800 hover:bg-slate-700"
              onClick={() => onPageChange?.(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
