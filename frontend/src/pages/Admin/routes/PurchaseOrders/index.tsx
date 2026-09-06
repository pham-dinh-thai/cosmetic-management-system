import React, { useMemo } from "react";
import { PageHeader, Input, Button } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { usePurchaseOrders } from "./hook";
import type { PurchaseOrder } from "./type";

const PurchaseOrdersPage: React.FC = () => {
  const { orders, loading, q, setQ } = usePurchaseOrders();

  const columns = useMemo<Column<PurchaseOrder>[]>(
    () => [
      { key: "code", header: "Mã phiếu", render: (o) => <span className="font-mono text-[12px]">{o.code}</span> },
      { key: "supplierName", header: "Nhà cung cấp", render: (o) => <span className="font-medium text-[#1c3a13]">{o.supplierName}</span> },
      { key: "createdDate", header: "Ngày lập", render: (o) => <span className="text-[#666666]">{o.createdDate}</span> },
      {
        key: "totalAmount",
        header: "Tổng tiền nhập",
        render: (o) => (
          <span className="font-mono font-medium text-[#1c3a13]">
            {o.totalAmount.toLocaleString("vi-VN")}₫
          </span>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        render: (o) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${
              o.status === "COMPLETED"
                ? "bg-[#e3ecd9] text-[#1c3a13]"
                : "bg-[#f3f0d9] text-[#9f995b]"
            }`}
          >
            {o.status === "COMPLETED" ? "Đã nhập kho" : "Phiếu tạm"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Nhập hàng"
        title="Phiếu nhập hàng"
        description="Quản lý việc nhập thêm hàng hóa và bổ sung tồn kho mỹ phẩm."
        actions={<Button variant="primary">+ Tạo phiếu nhập</Button>}
      />
      <div className="max-w-md">
        <Input
          placeholder="Tìm kiếm theo mã phiếu, tên NCC…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="py-12 text-center text-[#666666]">Đang tải…</div>
      ) : (
        <DataTable columns={columns} rows={orders} rowKey={(o) => o.id} empty="Chưa có phiếu nhập hàng" />
      )}
    </div>
  );
};

export default PurchaseOrdersPage;
