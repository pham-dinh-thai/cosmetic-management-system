import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { ConfirmModal } from "../../../../components/ui/ConfirmModal";
import { useCustomers } from "./hook";
import type { Customer } from "./type";

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers, loading, q, setQ, handleDeleteCustomer } = useCustomers();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const openAdd = () => {
    navigate("/admin/customers/add");
  };

  const openEdit = (c: Customer) => {
    navigate(`/admin/customers/${c.id}/edit`);
  };

  const openDelete = (c: Customer) => {
    setCustomerToDelete(c);
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (customerToDelete) {
      await handleDeleteCustomer(customerToDelete.id);
    }
    setIsConfirmOpen(false);
    setCustomerToDelete(null);
  };

  const columns = useMemo<Column<Customer>[]>(
    () => [
      { key: "code", header: "Mã KH", render: (c) => <span className="font-mono text-[12px]">{c.code}</span> },
      { key: "name", header: "Họ và tên", render: (c) => <span className="font-medium text-[#1c3a13]">{c.name}</span> },
      { key: "phone", header: "Số điện thoại", render: (c) => <span className="text-[#666666]">{c.phone}</span> },
      { key: "email", header: "Email", render: (c) => <span className="text-[#666666]">{c.email}</span> },
      { key: "address", header: "Địa chỉ", render: (c) => <span className="text-[#666666]">{c.address || "-"}</span> },
      { key: "orders", header: "Số đơn hàng", render: (c) => <span className="text-[#666666]">{c.orders}</span> },
      {
        key: "totalSpent",
        header: "Tổng chi tiêu",
        className: "text-right",
        render: (c) => (
          <span className="font-mono font-medium text-[#1c3a13]">
            {c.totalSpent.toLocaleString("vi-VN")}₫
          </span>
        ),
      },
      {
        key: "actions",
        header: "Thao tác",
        className: "text-right",
        render: (c) => (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => openEdit(c)}>
              Sửa
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white" onClick={() => openDelete(c)}>
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
        eyebrow="Quản lý / Khách hàng"
        title="Danh sách khách hàng"
        description="Quản lý thông tin khách hàng và lịch sử mua sắm."
        actions={
          <Button variant="primary" onClick={openAdd}>
            + Thêm khách hàng
          </Button>
        }
      />
      <div className="max-w-md">
        <Input
          placeholder="Tìm kiếm theo tên, số điện thoại, mã KH…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="py-12 text-center text-[#666666]">Đang tải…</div>
      ) : (
        <DataTable columns={columns} rows={customers} rowKey={(c) => c.id} empty="Chưa có thông tin khách hàng" />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Xóa khách hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng ${customerToDelete?.name}? Hành động này không thể hoàn tác.`}
        onConfirm={onConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isDestructive={true}
      />
    </div>
  );
};

export default CustomersPage;
