import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { usePurchaseOrders } from "./hook";
import { openPurchaseReceiptPrint } from "../../../../services/purchase-orders.service";
import { useBasePath } from "../../../../lib/useBasePath";
import type { PurchaseOrder } from "./type";

const statusMeta: Record<
  PurchaseOrder["status"],
  { label: string; className: string }
> = {
  PENDING: {
    label: "Chờ nhập kho",
    className: "bg-[#f3f0d9] text-[#9f995b]",
  },
  COMPLETED: {
    label: "Đã nhập kho",
    className: "bg-[#e3ecd9] text-[#1c3a13]",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-[#f0ded9] text-[#8f3f2a]",
  },
};

const PurchaseOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const basePath = useBasePath();
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
              statusMeta[o.status]?.className ?? "bg-[#eeeee9] text-[#666666]"
            }`}
          >
            {statusMeta[o.status]?.label ?? o.status}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Thao tác",
        className: "text-right",
        render: (o) => (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => openPurchaseReceiptPrint(o.id)}>
              In
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate(`${basePath}/purchase/${o.id}/edit`)}>
              Sửa
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Nhập hàng"
        title="Danh sách phiếu nhập hàng"
        description="Quản lý việc nhập thêm hàng hóa và bổ sung tồn kho mỹ phẩm."
        actions={<Button variant="primary" onClick={() => navigate(`${basePath}/purchase/add`)}>+ Tạo phiếu nhập</Button>}
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
