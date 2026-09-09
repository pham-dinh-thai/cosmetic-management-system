import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Button, Card } from "../../../../components/ui/Primitives";
import { useInventoryDetail } from "./hook";
import { useBasePath } from "../../../../lib/useBasePath";

const formatDate = (iso?: string | null): string => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("vi-VN");
};

const InventoryDetailPage: React.FC = () => {
  const { item, loading, error, onBack } = useInventoryDetail();
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
            <Button variant="ghost" onClick={onBack}>
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

  return (
    <div className="flex flex-col gap-8 pb-16">
      <PageHeader
        eyebrow="Quản lý / Tồn kho / Chi tiết"
        title={item.productName || item.variantId}
        description={`Mã phiếu: ${item.variantId}`}
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => navigate(`${basePath}/inventory/${item.id}/edit`)}
            >
              Sửa
            </Button>
            <Button variant="ghost" onClick={onBack}>
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
                  Người lập phiếu
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {item.createdByName ||
                    (item.createdBy ? item.createdBy : "—")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Số lượng tồn
                </span>
                <span className="text-[18px] font-[var(--font-seed-sans-mono)] font-medium text-[#1c3a13]">
                  {item.quantity.toLocaleString("vi-VN")} đơn vị
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Mức tồn tối thiểu
                </span>
                <span className="text-[18px] font-[var(--font-seed-sans-mono)] font-medium text-[#1c3a13]">
                  {item.minStock.toLocaleString("vi-VN")} đơn vị
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Hạn sử dụng
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {item.expiryDate ? formatDate(item.expiryDate) : "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Cập nhật lần cuối
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {formatDate(item.lastUpdatedAt)}
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
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Cập nhật gần nhất
                </span>
                <span className="text-[18px] font-medium text-[#1c3a13]">
                  {formatDate(item.updatedAt)}
                </span>
              </div>
            </div>
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
              <span className="font-[var(--font-seed-sans-mono)] text-[12px] text-[#1c3a13]">
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