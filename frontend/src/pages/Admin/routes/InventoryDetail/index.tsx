import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Button, Card } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { useInventoryDetail } from "./hook";
import { useBasePath } from "../../../../lib/useBasePath";
import type { InventoryBatch } from "../Inventory/type";

const formatDate = (iso?: string | null): string => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("vi-VN");
};

const isExpired = (iso: string): boolean => {
  const date = new Date(iso);
  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
};

const InventoryDetailPage: React.FC = () => {
  const { item, loading, error, saving, handleToggleBatch, onBack } = useInventoryDetail();
  const navigate = useNavigate();
  const basePath = useBasePath();

  if (loading) {
    return <div className="p-8 text-[#666666]">Đang tải dữ liệu...</div>;
  }

  if (error || !item) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow="Quản lý / Tồn kho / Lỗi"
          title="Không tìm thấy phiếu kho"
          actions={
            <Button variant="outline" onClick={onBack}>
              ← Trở về
            </Button>
          }
        />
        <div className="bg-[#eeeee9] text-[#1c3a13] p-4 rounded-[16px] text-[14px]">
          {error || "Phiếu kho không tồn tại."}
        </div>
      </div>
    );
  }

  const activeBatches = item.batches.filter((b) => b.isActive);
  const expiredCount = activeBatches.filter((b) => isExpired(b.expiredDate)).length;

  const batchColumns: Column<InventoryBatch>[] = [
    {
      key: "lotNumber",
      header: "Mã lô",
      render: (b) => <span className="font-mono text-[12px] break-all">{b.lotNumber}</span>,
    },
    {
      key: "supplierName",
      header: "Nhà cung cấp",
      render: (b) => <span>{b.supplierName || "—"}</span>,
    },
    {
      key: "quantity",
      header: "Số lượng",
      className: "text-center",
      render: (b) => <span>{b.quantity.toLocaleString("vi-VN")}</span>,
    },
    {
      key: "expiredDate",
      header: "Hạn sử dụng",
      render: (b) => (
        <span className={isExpired(b.expiredDate) ? "text-[#b04747] font-medium" : ""}>
          {formatDate(b.expiredDate)}
          {isExpired(b.expiredDate) ? " (đã hết hạn)" : ""}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Trạng thái",
      render: (b) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${
            b.isActive
              ? "bg-[#e3ecd9] text-[#1c3a13]"
              : "bg-[#eeeee9] text-[#666666]"
          }`}
        >
          {b.isActive ? "Đang hoạt động" : "Vô hiệu hoá"}
        </span>
      ),
    },
    {
      key: "actions",
      header: <div className="text-right">Thao tác</div>,
      className: "text-right",
      render: (b) => (
        <Button
          variant="outline"
          size="sm"
          disabled={saving}
          onClick={() => handleToggleBatch(b)}
        >
          {b.isActive ? "Vô hiệu hoá" : "Kích hoạt"}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-16">
      <PageHeader
        eyebrow="Quản lý / Tồn kho / Chi tiết"
        title={item.productName || item.variantId}
        description={`Mã phiếu: ${item.variantId}`}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => navigate(`${basePath}/inventory/${item.id}/edit`)}
            >
              Sửa
            </Button>
            <Button variant="outline" onClick={onBack}>
              ← Trở về
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card className="p-8 flex flex-col gap-6">
            <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
              Thông tin phiếu kho
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Sản phẩm
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {item.productName || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Phân loại
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {item.variantName || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Số lượng tồn
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {item.quantity.toLocaleString("vi-VN")} đơn vị
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Mức tồn tối thiểu
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {item.minStock.toLocaleString("vi-VN")} đơn vị
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Số lô đang hoạt động
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {activeBatches.length} lô
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Lô đã hết hạn
                </span>
                <span className="text-[18px] font-medium text-[#b04747]">
                  {expiredCount} lô
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Cập nhật gần nhất
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {formatDate(item.updatedAt)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Ngày tạo
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden !p-0">
            <div className="p-6 pb-2">
              <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
                Các lô hàng
              </h2>
            </div>
            <DataTable
              columns={batchColumns}
              rows={item.batches}
              rowKey={(b) => b.id}
              empty="Chưa có lô hàng nào"
            />
          </Card>
        </div>

        <div className="flex flex-col gap-8">
          <Card className="p-8 flex flex-col gap-6">
            <h2 className="text-[20px] text-[#1c3a13]" style={{ fontWeight: 350 }}>
              Trạng thái
            </h2>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                Dòng tồn kho
              </span>
              {item.isActive ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#e3ecd9] text-[#1c3a13]">
                  Đang hoạt động
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] bg-[#eeeee9] text-[#666666]">
                  Vô hiệu hoá
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                Mã phiếu
              </span>
              <span className="font-mono text-[12px] text-[#1c3a13]">
                {item.variantId}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailPage;