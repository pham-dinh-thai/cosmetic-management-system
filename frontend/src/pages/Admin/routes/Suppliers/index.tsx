import React, { useMemo } from "react";
import { PageHeader, Input, Button } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { useSuppliers } from "./hook";
import type { Supplier } from "./type";

const SuppliersPage: React.FC = () => {
  const { suppliers, loading, q, setQ } = useSuppliers();

  const columns = useMemo<Column<Supplier>[]>(
    () => [
      { key: "code", header: "Mã NCC", render: (s) => <span className="font-mono text-[12px]">{s.code}</span> },
      { key: "name", header: "Tên nhà cung cấp", render: (s) => <span className="font-medium text-[#1c3a13]">{s.name}</span> },
      { key: "contactName", header: "Người liên hệ", render: (s) => <span className="text-[#666666]">{s.contactName}</span> },
      { key: "phone", header: "Số điện thoại", render: (s) => <span className="text-[#666666]">{s.phone}</span> },
      { key: "email", header: "Email", render: (s) => <span className="text-[#666666]">{s.email}</span> },
      { key: "address", header: "Địa chỉ", render: (s) => <span className="text-[#666666]">{s.address}</span> },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Nhà cung cấp"
        title="Nhà cung cấp"
        description="Quản lý thông tin các nhà phân phối và nhà sản xuất mỹ phẩm."
        actions={<Button variant="primary">+ Thêm nhà cung cấp</Button>}
      />
      <div className="max-w-md">
        <Input
          placeholder="Tìm kiếm theo tên NCC, người liên hệ, mã…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="py-12 text-center text-[#666666]">Đang tải…</div>
      ) : (
        <DataTable columns={columns} rows={suppliers} rowKey={(s) => s.id} empty="Chưa có nhà cung cấp" />
      )}
    </div>
  );
};

export default SuppliersPage;
