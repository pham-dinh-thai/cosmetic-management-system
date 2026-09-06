import { useMemo, useState } from "react";
import { Input, Kpi, PageHeader } from "../../../components/ui/Primitives";
import { DataTable, StockBadge, type Column } from "../../../components/ui/DataTable";

interface InventoryItem {
  code: string;
  name: string;
  stock: number;
  status: "Còn hàng" | "Sắp hết" | "Hết hàng";
  value: string;
}

const INVENTORY: InventoryItem[] = [
  { code: "SC-01®", name: "Sữa rửa mặt vi sinh", stock: 184, status: "Còn hàng", value: "₫77.280.000" },
  { code: "AM-02™", name: "Tinh chất sáng da ban ngày", stock: 96, status: "Còn hàng", value: "₫65.280.000" },
  { code: "DM-02™", name: "Huyết thanh cân bằng", stock: 12, status: "Sắp hết", value: "₫7.080.000" },
  { code: "PM-02™", name: "Kem phục hồi ban đêm", stock: 0, status: "Hết hàng", value: "₫0" },
  { code: "SC-03®", name: "Toner dịu nhẹ", stock: 64, status: "Còn hàng", value: "₫24.320.000" },
  { code: "MS-04®", name: "Mặt nạ vi sinh", stock: 8, status: "Sắp hết", value: "₫2.240.000" },
  { code: "SC-05®", name: "Sữa rửa mặt than hoạt tính", stock: 0, status: "Hết hàng", value: "₫0" },
  { code: "AM-06™", name: "Tinh chất chống oxy hoá", stock: 142, status: "Còn hàng", value: "₫82.360.000" },
];

const Inventory: React.FC = () => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return INVENTORY;
    return INVENTORY.filter(
      (i) =>
        i.code.toLowerCase().includes(k) ||
        i.name.toLowerCase().includes(k),
    );
  }, [q]);

  const total = INVENTORY.length;
  const low = INVENTORY.filter((i) => i.status === "Sắp hết").length;
  const out = INVENTORY.filter((i) => i.status === "Hết hàng").length;
  const totalValue = INVENTORY.reduce(
    (acc, i) => acc + parseInt(i.value.replace(/\D/g, "") || "0", 10),
    0,
  );

  const columns: Column<InventoryItem>[] = [
    { key: "code", header: "Mã", render: (r) => <span className="font-medium uppercase tracking-[0.06em] text-[12px]">{r.code}</span> },
    { key: "name", header: "Tên sản phẩm", render: (r) => r.name },
    { key: "stock", header: "Tồn kho", render: (r) => <span className="font-medium">{r.stock}</span> },
    { key: "status", header: "Trạng thái", render: (r) => <StockBadge status={r.status} /> },
    {
      key: "actions",
      header: "Thao tác",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="text-[12px] uppercase tracking-[0.18em] text-[#1c3a13] hover:underline">
            Nhập thêm
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Kho"
        title="Kho hàng"
        description="Theo dõi tồn kho theo thời gian thực, cảnh báo sớm khi sắp hết hoặc hết hàng."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Kpi label="Tổng sản phẩm" value={String(total)} caption="SKU đang quản lý" accent="forest" />
        <Kpi label="Sắp hết" value={String(low)} caption="Dưới ngưỡng 20" accent="lime" />
        <Kpi label="Hết hàng" value={String(out)} caption="Cần nhập gấp" accent="olive" />
        <Kpi
          label="Giá trị hàng"
          value={"₫" + (totalValue / 1_000_000).toFixed(1) + "tr"}
          caption="Ước tính theo giá bán"
          accent="eucalyptus"
        />
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Tìm kiếm sản phẩm trong kho…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.code}
        empty="Không tìm thấy sản phẩm trong kho"
      />
    </div>
  );
};

export default Inventory;