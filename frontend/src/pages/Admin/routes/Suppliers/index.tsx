import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Select } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { useSuppliers, type SupplierStatusFilter } from "./hook";
import type { Supplier } from "./type";
import { useAuthStore } from "../../../../store/useAuthStore";
import { canWriteSuppliers } from "../../../../lib/permissions";
import { useBasePath } from "../../../../lib/useBasePath";

const STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Đã vô hiệu hoá" },
  { value: "all", label: "Tất cả" },
];

const SuppliersPage: React.FC = () => {
  const navigate = useNavigate();
  const basePath = useBasePath();
  const user = useAuthStore((s) => s.user);
  const canWrite = canWriteSuppliers(user);
  const { suppliers, loading, q, setQ, status, setStatus, handleToggleStatus } = useSuppliers();

  const openAdd = () => {
    navigate(`${basePath}/suppliers/add`);
  };

  const openEdit = (s: Supplier) => {
    navigate(`${basePath}/suppliers/${s.id}/edit`);
  };

  const columns = useMemo<Column<Supplier>[]>(
    () => [
      { key: "code", header: "Mã NCC", render: (s) => <span className="font-mono text-[12px]">{s.code}</span> },
      { key: "name", header: "Tên nhà cung cấp", render: (s) => <span className="font-medium text-[#1c3a13]">{s.name}</span> },
      { key: "phone", header: "Số điện thoại", render: (s) => <span className="text-[#666666]">{s.phone}</span> },
      { key: "email", header: "Email", render: (s) => <span className="text-[#666666]">{s.email}</span> },
      { key: "address", header: "Địa chỉ", render: (s) => <span className="text-[#666666]">{s.address}</span> },
      {
        key: "isActive",
        header: "Trạng thái",
        render: (s) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${
              s.isActive
                ? "bg-[#e3ecd9] text-[#1c3a13]"
                : "bg-[#eeeee9] text-[#666666]"
            }`}
          >
            {s.isActive ? "Đang hoạt động" : "Ngừng HĐ"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Thao tác",
        className: "text-right",
        render: (s) => (
          <div className="flex justify-end gap-2">
            {canWrite && (
              <>
                <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                  Sửa
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggleStatus(s)}>
                  {s.isActive ? "Vô hiệu hoá" : "Kích hoạt"}
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [canWrite, handleToggleStatus],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Nhà cung cấp"
        title="Danh sách nhà cung cấp"
        description="Quản lý thông tin các nhà phân phối và nhà sản xuất mỹ phẩm."
        actions={
          canWrite && (
            <Button variant="primary" onClick={openAdd}>+ Thêm nhà cung cấp</Button>
          )
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-7">
          <Input
            placeholder="Tìm kiếm theo tên NCC, mã…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="md:col-span-5">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as SupplierStatusFilter)}
            options={STATUS_OPTIONS}
          />
        </div>
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
