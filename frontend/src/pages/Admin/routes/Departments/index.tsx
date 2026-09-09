import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Select } from "../../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../../components/ui/DataTable";
import { useDepartments, type DepartmentStatusFilter } from "./hook";
import type { Department } from "./type";

const STATUS_OPTIONS = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Đã vô hiệu hoá" },
  { value: "all", label: "Tất cả" },
];

const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { departments, loading, q, setQ, status, setStatus, handleToggleStatus } = useDepartments();

  const openAdd = () => {
    navigate("/admin/departments/add");
  };

  const openEdit = (d: Department) => {
    navigate(`/admin/departments/${d.id}/edit`);
  };

  const columns = useMemo<Column<Department>[]>(
    () => [
      { key: "code", header: "Mã PB", render: (d) => <span className="font-mono text-[12px]">{d.code}</span> },
      { key: "name", header: "Tên phòng ban", render: (d) => <span className="font-medium text-[#1c3a13]">{d.name}</span> },
      {
        key: "isActive",
        header: "Trạng thái",
        render: (d) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${
              d.isActive
                ? "bg-[#e3ecd9] text-[#1c3a13]"
                : "bg-[#eeeee9] text-[#666666]"
            }`}
          >
            {d.isActive ? "Đang hoạt động" : "Tạm ngưng"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Thao tác",
        className: "text-right",
        render: (d) => (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => openEdit(d)}>
              Sửa
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleToggleStatus(d)}>
              {d.isActive ? "Vô hiệu hoá" : "Kích hoạt"}
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
        eyebrow="Quản lý / Phòng ban"
        title="Danh sách phòng ban"
        description="Quản lý thông tin phòng ban."
        actions={<Button variant="primary" onClick={openAdd}>+ Thêm phòng ban</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-7">
          <Input
            placeholder="Tìm kiếm theo tên phòng ban, mã…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="md:col-span-5">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as DepartmentStatusFilter)}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>
      {loading ? (
        <div className="py-12 text-center text-[#666666]">Đang tải…</div>
      ) : (
        <DataTable columns={columns} rows={departments} rowKey={(d) => d.id} empty="Chưa có phòng ban" />
      )}
    </div>
  );
};

export default DepartmentsPage;
