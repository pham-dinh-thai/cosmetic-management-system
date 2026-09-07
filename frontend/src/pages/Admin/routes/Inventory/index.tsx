import React, { useMemo } from "react";
import { PageHeader, Input, Button, Kpi } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { ConfirmModal } from "../../../../components/ui/ConfirmModal";
import { useInventory } from "./hook";
import type { InventoryItem } from "./type";

const InventoryPage: React.FC = () => {
  const { 
    inventory, loading, q, setQ, 
    confirmDelete, setConfirmDelete, 
    isModalOpen, setIsModalOpen, 
    editingId, formData, setFormData, 
    handleDeleteConfirm, openAddModal, openEditModal, handleSave 
  } = useInventory();

  const totalProducts = useMemo(() => inventory.reduce((sum, item) => sum + item.quantity, 0), [inventory]);
  const lowStock = useMemo(() => inventory.filter(item => item.quantity > 0 && item.quantity <= item.minThreshold).length, [inventory]);
  const outOfStock = useMemo(() => inventory.filter(item => item.quantity === 0).length, [inventory]);
  const totalValue = useMemo(() => inventory.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0), [inventory]);

  const formatValue = (val: number) => {
    if (val >= 1000000000) {
      return (val / 1000000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " tỷ";
    }
    if (val >= 1000000) {
      return (val / 1000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " triệu";
    }
    return val.toLocaleString("vi-VN") + "₫";
  };

  const columns = useMemo<Column<InventoryItem>[]>(
    () => [
      { key: "sku", header: "Mã SKU", render: (i) => <span className="font-mono text-[12px]">{i.sku}</span> },
      { key: "productName", header: "Tên sản phẩm", render: (i) => <span className="font-medium text-[#1c3a13]">{i.productName}</span> },
      { key: "variantName", header: "Biến thể", render: (i) => <span className="text-[#666666]">{i.variantName}</span> },
      { key: "location", header: "Vị trí kho", render: (i) => <span className="text-[#666666]">{i.location}</span> },
      {
        key: "quantity",
        header: "Số lượng tồn",
        render: (i) => {
          let badgeClass = "bg-[#e3ecd9] text-[#1c3a13]";
          let label = `${i.quantity} đơn vị`;
          if (i.quantity === 0) {
            badgeClass = "bg-[#f6e3e3] text-[#b04747]";
            label = "Hết hàng (0)";
          } else if (i.quantity <= i.minThreshold) {
            badgeClass = "bg-[#f3f0d9] text-[#9f995b]";
            label = `Sắp hết (${i.quantity})`;
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
            <Button variant="outline" size="sm" onClick={() => openEditModal(i)}>
              Sửa
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50/80" onClick={() => setConfirmDelete({ isOpen: true, item: i })}>
              Xoá
            </Button>
          </div>
        )
      }
    ],
    [openEditModal, setConfirmDelete],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Tồn kho"
        title="Quản lý tồn kho"
        description="Theo dõi số lượng sản phẩm lưu kho và vị trí lưu trữ."
        actions={
          <Button variant="primary" onClick={openAddModal}>
            + Thêm tồn kho
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
            caption="Dưới mức tối thiểu"
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
          placeholder="Tìm kiếm theo sản phẩm, SKU, biến thể…"
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
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xoá tồn kho"
        message={`Bạn có chắc chắn muốn xoá mục tồn kho "${confirmDelete.item?.productName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xoá mục"
        cancelText="Hủy"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, item: null })}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#fcfcf7] border border-[#1c3a13] rounded-2xl w-[90%] max-w-[500px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#eeeee9] bg-[#fcfcf7] shrink-0">
              <h3 className="text-[18px] text-[#1c3a13] font-medium">
                {editingId ? "Sửa thông tin tồn kho" : "Thêm tồn kho mới"}
              </h3>
            </div>
            <form
              onSubmit={handleSave}
              className="p-6 flex flex-col gap-4 bg-white overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Mã SKU *
                  </label>
                  <Input
                    value={formData.sku || ""}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Vị trí kho
                  </label>
                  <Input
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Tên sản phẩm *
                </label>
                <Input
                  value={formData.productName || ""}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Tên biến thể
                </label>
                <Input
                  value={formData.variantName || ""}
                  onChange={(e) => setFormData({ ...formData, variantName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Số lượng *
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.quantity ?? 0}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                    Mức tối thiểu *
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.minThreshold ?? 0}
                    onChange={(e) => setFormData({ ...formData, minThreshold: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-[#666666] uppercase tracking-[0.1em]">
                  Giá sản phẩm (VNĐ)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={formData.price ?? 0}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-[#eeeee9]">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary">
                  Lưu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
