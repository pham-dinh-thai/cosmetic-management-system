import React, { useMemo } from "react";
import { PageHeader, Input } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { useInventory } from "./hook";
import type { InventoryItem } from "./type";

const InventoryPage: React.FC = () => {
  const { inventory, loading, q, setQ } = useInventory();

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
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Tồn kho"
        title="Quản lý tồn kho"
        description="Theo dõi số lượng sản phẩm lưu kho và vị trí lưu trữ."
      />
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
    </div>
  );
};

export default InventoryPage;
