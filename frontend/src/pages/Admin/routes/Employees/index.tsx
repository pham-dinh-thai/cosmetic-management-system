import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Select } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { useEmployees, type EmployeeStatusFilter } from "./hook";
import type { Employee } from "./type";

const STATUS_OPTIONS = [
  { value: "active", label: "Đang làm việc" },
  { value: "inactive", label: "Đã nghỉ" },
  { value: "all", label: "Tất cả" },
];

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { employees, loading, q, setQ, status, setStatus, handleToggleStatus } = useEmployees();

  const openAdd = () => {
    navigate("/admin/employees/add");
  };

  const openEdit = (e: Employee) => {
    navigate(`/admin/employees/${e.id}/edit`);
  };

  const columns = useMemo<Column<Employee>[]>(
    () => [
      { key: "code", header: "Mã NV", render: (e) => <span className="font-mono text-[12px]">{e.code}</span> },
      { key: "name", header: "Họ và tên", render: (e) => <span className="font-medium text-[#1c3a13]">{e.name}</span> },
      { key: "position", header: "Chức vụ", render: (e) => <span className="text-[#666666]">{e.position}</span> },
      { key: "department", header: "Phòng ban", render: (e) => <span className="text-[#666666]">{e.department || e.departmentId || "-"}</span> },
      { key: "phone", header: "Số điện thoại", render: (e) => <span className="text-[#666666]">{e.phone}</span> },
      { key: "email", header: "Email", render: (e) => <span className="text-[#666666]">{e.email}</span> },
      { key: "hiredAt", header: "Ngày vào làm", render: (e) => <span className="text-[#666666]">{e.hiredAt ? new Date(e.hiredAt).toLocaleDateString("vi-VN") : "-"}</span> },
      {
        key: "status",
        header: "Trạng thái",
        render: (e) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${
              e.status === "ACTIVE"
                ? "bg-[#e3ecd9] text-[#1c3a13]"
                : "bg-[#eeeee9] text-[#666666]"
            }`}
          >
            {e.status === "ACTIVE" ? "Đang làm việc" : "Đã nghỉ"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Thao tác",
        className: "text-right",
        render: (e) => (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => openEdit(e)}>
              Sửa
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleToggleStatus(e)}>
              {e.status === "ACTIVE" ? "Vô hiệu hoá" : "Kích hoạt"}
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
        eyebrow="Quản lý / Nhân viên"
        title="Danh sách nhân viên"
        description="Quản lý thông tin và tài khoản nhân viên trong hệ thống."
        actions={<Button variant="primary" onClick={openAdd}>+ Thêm nhân viên</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-7">
          <Input
            placeholder="Tìm kiếm theo tên, chức vụ, mã NV…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="md:col-span-5">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as EmployeeStatusFilter)}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>
      {loading ? (
        <div className="py-12 text-center text-[#666666]">Đang tải…</div>
      ) : (
        <DataTable columns={columns} rows={employees} rowKey={(e) => e.id} empty="Chưa có thông tin nhân viên" />
      )}
    </div>
  );
};

export default EmployeesPage;
