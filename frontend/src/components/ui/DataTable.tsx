import React, { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { Button } from "./Primitives";

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  empty?: ReactNode;
  rowKey: (row: T) => string;
  pageSize?: number;
  showPagination?: boolean;
}

export function DataTable<T>({
  columns,
  rows,
  empty,
  rowKey,
  pageSize = 5,
  showPagination = true,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [rows]);

  const totalPages = Math.ceil(rows.length / pageSize) || 1;

  const paginatedRows = useMemo(() => {
    if (!showPagination) return rows;
    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, currentPage, pageSize, showPagination]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[16px] border border-[#eeeee9] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#eeeee9]">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-5 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666] ${c.className ?? ""}`}
                  >
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-12 text-center text-[14px] text-[#666666]"
                  >
                    {empty ?? "Chưa có dữ liệu"}
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, i) => (
                  <tr
                    key={rowKey(row)}
                    className={
                      i % 2 === 0
                        ? "bg-[#fcfcf7]"
                        : "bg-[#fcfcf7]"
                    }
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-5 py-4 text-[14px] text-[#1c3a13] border-t border-[#eeeee9] ${c.className ?? ""}`}
                      >
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {showPagination && rows.length > pageSize && (
        <div className="flex items-center justify-between px-2">
          <span className="text-[14px] text-[#666666]">
            Trang {currentPage} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Tiếp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const TierBadge: React.FC<{ tier: string }> = ({ tier }) => {
  const map: Record<string, string> = {
    "Vàng": "bg-[#9f995b] text-[#fcfcf7]",
    "Bạc": "bg-[#c4c7c4] text-[#1c3a13]",
    "Đồng": "bg-[#757c5d] text-[#fcfcf7]",
    "Kim cương": "bg-[#1c3a13] text-[#fcfcf7]",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${map[tier] ?? "bg-[#eeeee9] text-[#1c3a13]"}`}
    >
      {tier}
    </span>
  );
};

export const StockBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    "Sắp hết": "bg-[#d3fa99] text-[#1c3a13]",
    "Hết hàng": "bg-[#1c3a13] text-[#fcfcf7]",
    "Còn hàng": "bg-[#eeeee9] text-[#1c3a13]",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${map[status] ?? "bg-[#eeeee9] text-[#1c3a13]"}`}
    >
      {status}
    </span>
  );
};