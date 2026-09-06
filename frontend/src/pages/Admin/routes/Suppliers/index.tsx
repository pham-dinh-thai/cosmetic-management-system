import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { ConfirmModal } from "../../../../components/ui/ConfirmModal";
import { useSuppliers } from "./hook";
import type { Supplier } from "./type";

const SuppliersPage: React.FC = () => {
  const navigate = useNavigate();
  const { suppliers, loading, q, setQ, handleDeleteSupplier } = useSuppliers();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const openAdd = () => {
    navigate("/admin/suppliers/add");
  };

  const openEdit = (s: Supplier) => {
    navigate(`/admin/suppliers/${s.id}/edit`);
  };

  const openDelete = (s: Supplier) => {
    setSupplierToDelete(s);
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (supplierToDelete) {
      await handleDeleteSupplier(supplierToDelete.id);
    }
    setIsConfirmOpen(false);
    setSupplierToDelete(null);
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
            <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
              Sửa
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white" onClick={() => openDelete(s)}>
              Xóa
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Nhà cung cấp"
        title="Nhà cung cấp"
        description="Quản lý thông tin các nhà phân phối và nhà sản xuất mỹ phẩm."
        actions={<Button variant="primary" onClick={openAdd}>+ Thêm nhà cung cấp</Button>}
      />
      <div className="max-w-md">
        <Input
          placeholder="Tìm kiếm theo tên NCC, mã…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="py-12 text-center text-[#666666]">Đang tải…</div>
      ) : (
        <DataTable columns={columns} rows={suppliers} rowKey={(s) => s.id} empty="Chưa có nhà cung cấp" />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Xóa nhà cung cấp"
        message={`Bạn có chắc chắn muốn xóa nhà cung cấp ${supplierToDelete?.name}? Hành động này không thể hoàn tác.`}
        onConfirm={onConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isDestructive={true}
      />
    </div>
  );
};

export default SuppliersPage;
