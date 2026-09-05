import { useMemo, useState } from "react";
import { Button, Input, PageHeader } from "../../../components/ui/Primitives";
import { DataTable, TierBadge, type Column } from "../../../components/ui/DataTable";

interface Customer {
  code: string;
  name: string;
  phone: string;
  tier: "Kim cương" | "Vàng" | "Bạc" | "Đồng";
  spent: string;
}

const CUSTOMERS: Customer[] = [
  { code: "CUS-001A", name: "Nguyễn Thanh Linh", phone: "0901 234 567", tier: "Kim cương", spent: "₫42.860.000" },
  { code: "CUS-002B", name: "Trần Đức Trang", phone: "0912 345 678", tier: "Vàng", spent: "₫18.420.000" },
  { code: "CUS-003C", name: "Phạm Khánh Mai", phone: "0938 111 222", tier: "Bạc", spent: "₫6.940.000" },
  { code: "CUS-004D", name: "Lê Hoàng Anh", phone: "0976 555 888", tier: "Đồng", spent: "₫2.180.000" },
  { code: "CUS-005E", name: "Đỗ Quỳnh Nhi", phone: "0982 444 333", tier: "Vàng", spent: "₫21.700.000" },
  { code: "CUS-006F", name: "Vũ Minh Châu", phone: "0909 727 818", tier: "Bạc", spent: "₫8.560.000" },
  { code: "CUS-007G", name: "Hoàng Bảo Trâm", phone: "0935 100 200", tier: "Kim cương", spent: "₫68.120.000" },
];

const Customers: React.FC = () => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return CUSTOMERS;
    return CUSTOMERS.filter(
      (c) =>
        c.code.toLowerCase().includes(k) ||
        c.name.toLowerCase().includes(k) ||
        c.phone.toLowerCase().includes(k),
    );
  }, [q]);

  const columns: Column<Customer>[] = [
    { key: "code", header: "Mã", render: (r) => <span className="font-medium uppercase tracking-[0.06em] text-[12px]">{r.code}</span> },
    { key: "name", header: "Họ tên", render: (r) => r.name },
    { key: "phone", header: "Số điện thoại", render: (r) => r.phone },
    { key: "tier", header: "Hạng", render: (r) => <TierBadge tier={r.tier} /> },
    { key: "spent", header: "Chi tiêu", render: (r) => r.spent },
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
        eyebrow="Quản lý / Khách hàng"
        title="Khách hàng"
        description="Danh sách khách hàng đã đăng ký, phân hạng thành viên và tổng chi tiêu lũy kế."
        actions={<Button variant="primary">+ Thêm khách hàng</Button>}
      />

      <div className="flex items-center gap-3 max-w-md">
        <Input
          placeholder="Tìm kiếm theo mã, họ tên, SĐT…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.code}
        empty="Không tìm thấy khách hàng phù hợp"
      />
    </div>
  );
};

export default Customers;