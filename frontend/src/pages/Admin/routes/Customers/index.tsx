import React, { useMemo } from "react";
import { PageHeader, Input } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { useCustomers } from "./hook";
import type { Customer } from "./type";

const CustomersPage: React.FC = () => {
  const { customers, loading, q, setQ } = useCustomers();

  const columns = useMemo<Column<Customer>[]>(
    () => [
      { key: "code", header: "Mã KH", render: (c) => <span className="font-mono text-[12px]">{c.code}</span> },
      { key: "name", header: "Họ và tên", render: (c) => <span className="font-medium text-[#1c3a13]">{c.name}</span> },
      { key: "phone", header: "Số điện thoại", render: (c) => <span className="text-[#666666]">{c.phone}</span> },
      { key: "email", header: "Email", render: (c) => <span className="text-[#666666]">{c.email}</span> },
      { key: "orders", header: "Số đơn hàng", render: (c) => <span className="text-[#666666]">{c.orders}</span> },
      {
        key: "totalSpent",
        header: "Tổng chi tiêu",
        className: "text-right",
        render: (c) => (
          <span className="font-mono font-medium text-[#1c3a13]">
            {c.totalSpent.toLocaleString("vi-VN")}₫
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Khách hàng"
        title="Danh sách khách hàng"
        description="Quản lý thông tin khách hàng và lịch sử mua sắm."
      />
      <div className="max-w-md">
        <Input
          placeholder="Tìm kiếm theo tên, số điện thoại, mã KH…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="py-12 text-center text-[#666666]">Đang tải…</div>
      ) : (
        <DataTable columns={columns} rows={customers} rowKey={(c) => c.id} empty="Chưa có thông tin khách hàng" />
      )}
    </div>
  );
};

export default CustomersPage;
