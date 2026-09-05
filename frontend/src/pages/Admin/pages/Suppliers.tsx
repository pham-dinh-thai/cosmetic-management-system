import { useMemo, useState } from "react";
import { Button, Input, PageHeader } from "../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../components/ui/DataTable";

interface Supplier {
  code: string;
  name: string;
  phone: string;
  email: string;
  debt: string;
  debtPositive: boolean;
}

const SUPPLIERS: Supplier[] = [
  { code: "SUP-001", name: "Công ty TNHH Mỹ phẩm Xanh", phone: "028 1234 5678", email: "contact@xanhcos.vn", debt: "₫12.400.000", debtPositive: true },
  { code: "SUP-002", name: "Nhà phân phối Ánh Dương", phone: "024 9876 5432", email: "sales@anhduong.vn", debt: "₫0", debtPositive: false },
  { code: "SUP-003", name: "Botanic Labs Việt Nam", phone: "028 3456 7890", email: "hello@botanic.vn", debt: "₫3.200.000", debtPositive: true },
  { code: "SUP-004", name: "Công ty CP Hương Liệu Việt", phone: "0236 555 111", email: "info@huonglieu.vn", debt: "₫0", debtPositive: false },
  { code: "SUP-005", name: "Kobayashi Trading Co.", phone: "028 7777 2222", email: "vn@kobayashi.jp", debt: "₫28.900.000", debtPositive: true },
];

const Suppliers: React.FC = () => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return SUPPLIERS;
    return SUPPLIERS.filter(
      (s) =>
        s.code.toLowerCase().includes(k) ||
        s.name.toLowerCase().includes(k) ||
        s.phone.toLowerCase().includes(k),
    );
  }, [q]);

  const columns: Column<Supplier>[] = [
    { key: "code", header: "Mã", render: (r) => <span className="font-medium uppercase tracking-[0.06em] text-[12px]">{r.code}</span> },
    { key: "name", header: "Tên nhà cung cấp", render: (r) => r.name },
    { key: "phone", header: "Số điện thoại", render: (r) => r.phone },
    {
      key: "debt",
      header: "Công nợ",
      render: (r) => (
        <span className={r.debtPositive ? "text-[#1c3a13]" : "text-[#666666]"}>
          {r.debt}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">Xem</Button>
          <Button variant="outline" size="sm">Sửa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Nhà cung cấp"
        title="Nhà cung cấp"
        description="Danh sách đối tác cung ứng nguyên liệu và thành phẩm — theo dõi công nợ và lịch sử giao dịch."
        actions={<Button variant="primary">+ Thêm nhà cung cấp</Button>}
      />

      <div className="max-w-md">
        <Input
          placeholder="Tìm kiếm theo mã, tên, SĐT…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.code}
        empty="Không tìm thấy nhà cung cấp phù hợp"
      />
    </div>
  );
};

export default Suppliers;