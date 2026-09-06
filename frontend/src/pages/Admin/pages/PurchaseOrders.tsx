import { useState } from "react";
import {
  Button,
  Card,
  Input,
  PageHeader,
  Select,
} from "../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../components/ui/DataTable";

interface PurchaseItem {
  id: string;
  product: string;
  qty: number;
  unitPrice: string;
  total: string;
}

const SUPPLIERS = [
  { value: "SUP-001", label: "Công ty TNHH Mỹ phẩm Xanh" },
  { value: "SUP-002", label: "Nhà phân phối Ánh Dương" },
  { value: "SUP-003", label: "Botanic Labs Việt Nam" },
  { value: "SUP-004", label: "Công ty CP Hương Liệu Việt" },
  { value: "SUP-005", label: "Kobayashi Trading Co." },
];

const PRODUCT_OPTIONS = [
  { value: "SC-01®", label: "SC-01® · Sữa rửa mặt vi sinh" },
  { value: "AM-02™", label: "AM-02™ · Tinh chất sáng da ban ngày" },
  { value: "DM-02™", label: "DM-02™ · Huyết thanh cân bằng" },
  { value: "PM-02™", label: "PM-02™ · Kem phục hồi ban đêm" },
  { value: "SC-03®", label: "SC-03® · Toner dịu nhẹ" },
];

const formatVnd = (n: number) => "₫" + n.toLocaleString("vi-VN");

const PurchaseOrders: React.FC = () => {
  const [supplier, setSupplier] = useState("SUP-001");
  const [code] = useState("PN-2026-0912");
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: "i1",
      product: "SC-01® · Sữa rửa mặt vi sinh",
      qty: 50,
      unitPrice: "260.000",
      total: "13.000.000",
    },
    {
      id: "i2",
      product: "AM-02™ · Tinh chất sáng da ban ngày",
      qty: 30,
      unitPrice: "420.000",
      total: "12.600.000",
    },
  ]);
  const [discount, setDiscount] = useState("0");

  const subtotal = items.reduce(
    (acc, it) => acc + parseInt(it.total.replace(/\D/g, "") || "0", 10),
    0,
  );
  const discountNum = parseInt(discount.replace(/\D/g, "") || "0", 10);
  const grandTotal = Math.max(subtotal - discountNum, 0);

  const updateQty = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const unit = parseInt(it.unitPrice.replace(/\D/g, "") || "0", 10);
        return { ...it, qty, total: formatVnd(qty * unit) };
      }),
    );
  };

  const updateUnit = (id: string, raw: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const num = parseInt(raw.replace(/\D/g, "") || "0", 10);
        const total = it.qty * num;
        return {
          ...it,
          unitPrice: formatVnd(num),
          total: formatVnd(total),
        };
      }),
    );
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      {
        id: `i${prev.length + 1}-${Date.now()}`,
        product: PRODUCT_OPTIONS[0].label,
        qty: 1,
        unitPrice: "0",
        total: "0",
      },
    ]);

  const columns: Column<PurchaseItem>[] = [
    {
      key: "product",
      header: "Sản phẩm",
      render: (r) => (
        <select
          value={r.product}
          onChange={(e) =>
            setItems((prev) =>
              prev.map((it) =>
                it.id === r.id ? { ...it, product: e.target.value } : it,
              ),
            )
          }
          className="w-full rounded-lg border border-[#c4c7c4] bg-[#fcfcf7] px-3 py-2 text-[14px] text-[#1c3a13] focus:outline-none focus:border-[#1c3a13]"
        >
          {PRODUCT_OPTIONS.map((o) => (
            <option key={o.value} value={o.label}>
              {o.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "qty",
      header: "Số lượng",
      render: (r) => (
        <input
          type="number"
          min={1}
          value={r.qty}
          onChange={(e) => updateQty(r.id, Math.max(1, Number(e.target.value)))}
          className="w-24 rounded-lg border border-[#c4c7c4] bg-[#fcfcf7] px-3 py-2 text-[14px] text-[#1c3a13] focus:outline-none focus:border-[#1c3a13]"
        />
      ),
    },
    {
      key: "unitPrice",
      header: "Đơn giá",
      render: (r) => (
        <input
          type="text"
          value={r.unitPrice}
          onChange={(e) => updateUnit(r.id, e.target.value)}
          className="w-32 rounded-lg border border-[#c4c7c4] bg-[#fcfcf7] px-3 py-2 text-[14px] text-[#1c3a13] focus:outline-none focus:border-[#1c3a13]"
        />
      ),
    },
    {
      key: "total",
      header: "Thành tiền",
      render: (r) => <span className="font-medium">{r.total}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <button
          type="button"
          onClick={() => removeItem(r.id)}
          className="text-[12px] uppercase tracking-[0.18em] text-[#666666] hover:text-[#1c3a13]"
        >
          Xóa
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Nhập hàng"
        title="Tạo phiếu nhập"
        description="Ghi nhận hàng nhập từ nhà cung cấp, theo dõi tồn kho và công nợ."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666] mb-2">
            Nhà cung cấp
          </label>
          <Select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            options={SUPPLIERS}
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666] mb-2">
            Mã phiếu nhập
          </label>
          <Input value={code} readOnly className="bg-[#eeeee9]" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <DataTable
          columns={columns}
          rows={items}
          rowKey={(r) => r.id}
          empty="Chưa có sản phẩm trong phiếu"
        />
        <div>
          <Button variant="outline" size="sm" onClick={addItem}>
            + Thêm sản phẩm
          </Button>
        </div>
      </div>

      <Card className="flex flex-col gap-5">
        <h3
          className="text-[#1c3a13]"
          style={{ fontWeight: 350, fontSize: "20px", letterSpacing: "-0.48px" }}
        >
          Tổng kết phiếu nhập
        </h3>

        <div className="flex flex-col gap-3 max-w-sm ml-auto w-full">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-[#666666]">Tổng tiền</span>
            <span className="text-[#1c3a13] font-medium">{formatVnd(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-[14px] gap-3">
            <span className="text-[#666666] shrink-0">Giảm giá</span>
            <input
              type="text"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0"
              className="w-32 rounded-lg border border-[#c4c7c4] bg-[#fcfcf7] px-3 py-2 text-[14px] text-[#1c3a13] focus:outline-none focus:border-[#1c3a13] text-right"
            />
          </div>
          <div className="border-t border-[#eeeee9] pt-3 flex items-center justify-between">
            <span className="text-[14px] text-[#1c3a13]">Tổng thanh toán</span>
            <span
              className="text-[#1c3a13]"
              style={{ fontWeight: 350, fontSize: "24px", letterSpacing: "-0.48px" }}
            >
              {formatVnd(grandTotal)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost">Huỷ</Button>
          <Button variant="outline">In</Button>
          <Button variant="primary">Hoàn tất</Button>
        </div>
      </Card>
    </div>
  );
};

export default PurchaseOrders;