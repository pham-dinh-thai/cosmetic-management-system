import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { ConfirmModal } from "../../../../components/ui/ConfirmModal";
import { useEmployees } from "./hook";
import type { Employee } from "./type";

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { employees, loading, q, setQ, handleDeleteEmployee } = useEmployees();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const openAdd = () => {
    navigate("/admin/employees/add");
  };

  const openEdit = (e: Employee) => {
    navigate(`/admin/employees/${e.id}/edit`);
  };

  const openDelete = (e: Employee) => {
    setEmployeeToDelete(e);
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (employeeToDelete) {
      await handleDeleteEmployee(employeeToDelete.id);
    }
    setIsConfirmOpen(false);
    setEmployeeToDelete(null);
  };

  const columns = useMemo<Column<Employee>[]>(
    () => [
      { key: "code", header: "Mã NV", render: (e) => <span className="font-mono text-[12px]">{e.code}</span> },
      { key: "name", header: "Họ và tên", render: (e) => <span className="font-medium text-[#1c3a13]">{e.name}</span> },
      { key: "position", header: "Chức vụ", render: (e) => <span className="text-[#666666]">{e.position}</span> },
      { key: "department", header: "Phòng ban", render: (e) => <span className="text-[#666666]">{e.departmentId || "-"}</span> },
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
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white" onClick={() => openDelete(e)}>
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
        eyebrow="Quản lý / Nhân viên"
        title="Danh sách nhân viên"
        description="Quản lý thông tin và tài khoản nhân viên trong hệ thống."
        actions={<Button variant="primary" onClick={openAdd}>+ Thêm nhân viên</Button>}
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

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Xóa nhân viên"
        message={`Bạn có chắc chắn muốn xóa nhân viên ${employeeToDelete?.name}? Hành động này không thể hoàn tác.`}
        onConfirm={onConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isDestructive={true}
      />
    </div>
  );
};

export default EmployeesPage;
