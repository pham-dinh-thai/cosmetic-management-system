import React, { useMemo } from "react";
import { PageHeader, Input, Button } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { useEmployees } from "./hook";
import type { Employee } from "./type";

const EmployeesPage: React.FC = () => {
  const { employees, loading, q, setQ } = useEmployees();

  const columns = useMemo<Column<Employee>[]>(
    () => [
      { key: "code", header: "Mã NV", render: (e) => <span className="font-mono text-[12px]">{e.code}</span> },
      { key: "name", header: "Họ và tên", render: (e) => <span className="font-medium text-[#1c3a13]">{e.name}</span> },
      { key: "role", header: "Vị trí / Chức vụ", render: (e) => <span className="text-[#666666]">{e.role}</span> },
      { key: "phone", header: "Số điện thoại", render: (e) => <span className="text-[#666666]">{e.phone}</span> },
      { key: "email", header: "Email", render: (e) => <span className="text-[#666666]">{e.email}</span> },
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
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Quản lý / Nhân viên"
        title="Danh sách nhân viên"
        description="Quản lý thông tin và tài khoản nhân viên trong hệ thống."
        actions={<Button variant="primary">+ Thêm nhân viên</Button>}
      />
      <div className="max-w-md">
        <Input
          placeholder="Tìm kiếm theo tên, chức vụ, mã NV…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
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
