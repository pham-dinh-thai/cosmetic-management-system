import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Select } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { useCustomers, type CustomerStatusFilter } from "./hook";
import type { Customer } from "./type";

const STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Đã vô hiệu hoá" },
  { value: "all", label: "Tất cả" },
];

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers, loading, q, setQ, status, setStatus, handleToggleStatus } = useCustomers();

  const openAdd = () => {
    navigate("/admin/customers/add");
  };

  const openEdit = (c: Customer) => {
    navigate(`/admin/customers/${c.id}/edit`);
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
        key: "isActive",
        header: "Trạng thái",
        render: (c) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${
              c.isActive
                ? "bg-[#e3ecd9] text-[#1c3a13]"
                : "bg-[#eeeee9] text-[#666666]"
            }`}
          >
            {c.isActive ? "Đang hoạt động" : "Vô hiệu hoá"}
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
            <Button variant="outline" size="sm" onClick={() => handleToggleStatus(c)}>
              {c.isActive ? "Vô hiệu hoá" : "Kích hoạt"}
            </Button>
          </div>
        ),
      },
    ],
    [handleToggleStatus],
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-7">
          <Input
            placeholder="Tìm kiếm theo tên, số điện thoại, mã KH…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="md:col-span-5">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as CustomerStatusFilter)}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>
      {loading ? (
        <div className="py-12 text-center text-[#666666]">Đang tải…</div>
      ) : (
        <DataTable columns={columns} rows={customers} rowKey={(c) => c.id} empty="Chưa có thông tin khách hàng" />
      )}
    </div>
  );
};

export default CustomersPage;