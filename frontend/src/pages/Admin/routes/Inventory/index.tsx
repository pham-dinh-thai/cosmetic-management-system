import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader, Input, Button, Kpi } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { ConfirmModal } from "../../../../components/ui/ConfirmModal";
import { useInventory } from "./hook";
import { inventoryApi } from "./api";
import type { InventoryItem } from "./type";

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { inventory, loading, q, setQ, reload } = useInventory();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] =
    useState<InventoryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalProducts = useMemo(() => inventory.reduce((sum, item) => sum + item.quantity, 0), [inventory]);
  const lowStock = useMemo(() => inventory.filter(item => item.quantity > 0 && item.quantity <= item.minStock).length, [inventory]);
  const outOfStock = useMemo(() => inventory.filter(item => item.quantity === 0).length, [inventory]);
  const totalValue = useMemo(
    () => inventory.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0),
    [inventory],
  );

  const formatValue = (val: number) => {
    if (val >= 1000000000) {
      return (val / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " tỷ";
    }
    if (val >= 1000000) {
      return (val / 1000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " triệu";
    }
    return val.toLocaleString("vi-VN") + "₫";
  };

  const openEdit = (i: InventoryItem) => {
    navigate(`/admin/inventory/${i.id}/edit`);
  };

  const openDelete = (i: InventoryItem) => {
    setInventoryToDelete(i);
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!inventoryToDelete) return;
    setDeleting(true);
    try {
      await inventoryApi.deleteInventory(inventoryToDelete.id);
      toast.success("Đã xóa dòng tồn kho");
      setIsConfirmOpen(false);
      setInventoryToDelete(null);
      reload();
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa dòng tồn kho");
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<Column<InventoryItem>[]>(
    () => [
      { key: "variantId", header: "Mã phiếu kho", render: (i) => <span className="font-mono text-[12px] break-all">{i.variantId}</span> },
      { key: "productName", header: "Tên sản phẩm", render: (i) => <span className="font-medium text-[#1c3a13]">{i.productName || "-"}</span> },
      { key: "variantName", header: "Phân loại", render: (i) => <span className="text-[#666666]">{i.variantName || "-"}</span> },
      {
        key: "quantity",
        header: "Số lượng tồn",
        render: (i) => {
          let badgeClass = "bg-[#e3ecd9] text-[#1c3a13]";
          let label = `${i.quantity} đơn vị`;
          if (i.quantity === 0) {
            badgeClass = "bg-[#f6e3e3] text-[#b04747]";
            label = "Hết hàng (0)";
          } else if (i.quantity <= i.minStock) {
            badgeClass = "bg-[#f3f0d9] text-[#9f995b]";
            label = `Sắp hết (${i.quantity}/${i.minStock})`;
          }
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${badgeClass}`}>
              {label}
            </span>
          );
        },
      },
      {
        key: "actions",
        header: <div className="text-right">Thao tác</div>,
        className: "text-right",
        render: (i) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEdit(i)}
            >
              Sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => openDelete(i)}
            >
              Xóa
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
        eyebrow="Quản lý / Tồn kho"
        title="Quản lý tồn kho"
        description="Theo dõi số lượng sản phẩm lưu kho."
        actions={
          <Button variant="primary" onClick={() => navigate("/admin/inventory/add")}>
            + Nhập kho
          </Button>
        }
      />
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium text-[#1c3a13]">Tồn kho hiện tại</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Kpi
            label="Tổng SP"
            value={totalProducts.toLocaleString("vi-VN")}
            caption="Số lượng sản phẩm trong kho"
            accent="forest"
          />
          <Kpi
            label="Sắp hết"
            value={lowStock.toLocaleString("vi-VN")}
            caption="Dưới mức tồn tối thiểu"
            accent="sage"
          />
          <Kpi
            label="Hết hàng"
            value={outOfStock.toLocaleString("vi-VN")}
            caption="Cần nhập thêm"
            accent="lime"
          />
          <Kpi
            label="Giá trị hàng"
            value={formatValue(totalValue)}
            caption="Tổng giá trị quy đổi"
            accent="olive"
          />
        </div>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Tìm kiếm theo sản phẩm, mã biến thể…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="py-12 text-center text-[#666666]">Đang tải…</div>
      ) : (
        <DataTable columns={columns} rows={inventory} rowKey={(i) => i.id} empty="Chưa có dữ liệu kho" />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Xóa dòng tồn kho"
        message={`Bạn có chắc muốn xóa dòng tồn kho của "${inventoryToDelete?.productName || ""}" (${
          inventoryToDelete?.variantName || inventoryToDelete?.variantId || ""
        })? Hành động này không thể hoàn tác.`}
        onConfirm={onConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setInventoryToDelete(null);
        }}
        confirmText={deleting ? "Đang xóa..." : "Xóa"}
        cancelText="Hủy"
        isDestructive
      />
    </div>
  );
};

export default InventoryPage;