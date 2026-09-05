import { useMemo, useState } from "react";
import {
  Button,
  Input,
  PageHeader,
  Select,
} from "../../../components/ui/Primitives";
import { DataTable, type Column } from "../../../components/ui/DataTable";

interface Employee {
  code: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: "Admin" | "Nhân viên" | "Quản lý";
  status: "Đang làm" | "Tạm nghỉ";
}

const EMPLOYEES: Employee[] = [
  { code: "EMP-001", name: "Nguyễn Văn An", email: "an@guardian.vn", phone: "0901 111 222", department: "Bán hàng", role: "Quản lý", status: "Đang làm" },
  { code: "EMP-002", name: "Trần Thị Bình", email: "binh@guardian.vn", phone: "0912 222 333", department: "Tư vấn", role: "Nhân viên", status: "Đang làm" },
  { code: "EMP-003", name: "Lê Văn Cường", email: "cuong@guardian.vn", phone: "0938 333 444", department: "Kho", role: "Nhân viên", status: "Đang làm" },
  { code: "EMP-004", name: "Phạm Thị Dung", email: "dung@guardian.vn", phone: "0976 444 555", department: "Marketing", role: "Nhân viên", status: "Tạm nghỉ" },
  { code: "EMP-005", name: "Hoàng Văn Em", email: "em@guardian.vn", phone: "0982 555 666", department: "Kế toán", role: "Admin", status: "Đang làm" },
  { code: "EMP-006", name: "Đỗ Thị Phương", email: "phuong@guardian.vn", phone: "0909 666 777", department: "Bán hàng", role: "Nhân viên", status: "Đang làm" },
];

const DEPARTMENTS = [
  { value: "all", label: "Tất cả phòng ban" },
  { value: "Bán hàng", label: "Bán hàng" },
  { value: "Tư vấn", label: "Tư vấn" },
  { value: "Kho", label: "Kho" },
  { value: "Marketing", label: "Marketing" },
  { value: "Kế toán", label: "Kế toán" },
];

const ROLES = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "Admin", label: "Admin" },
  { value: "Quản lý", label: "Quản lý" },
  { value: "Nhân viên", label: "Nhân viên" },
];

const STATUSES = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "Đang làm", label: "Đang làm" },
  { value: "Tạm nghỉ", label: "Tạm nghỉ" },
];

const StatusBadge: React.FC<{ status: Employee["status"] }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] ${
      status === "Đang làm"
        ? "bg-[#d3fa99] text-[#1c3a13]"
        : "bg-[#eeeee9] text-[#666666]"
    }`}
  >
    {status}
  </span>
);

const Employees: React.FC = () => {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return EMPLOYEES.filter((e) => {
      const matchQ =
        !k ||
        e.code.toLowerCase().includes(k) ||
        e.name.toLowerCase().includes(k) ||
        e.email.toLowerCase().includes(k);
      return (
        matchQ &&
        (dept === "all" || e.department === dept) &&
        (role === "all" || e.role === role) &&
        (status === "all" || e.status === status)
      );
    });
  }, [q, dept, role, status]);

  const columns: Column<Employee>[] = [
    { key: "code", header: "Mã", render: (r) => <span className="font-medium uppercase tracking-[0.06em] text-[12px]">{r.code}</span> },
    { key: "name", header: "Họ tên", render: (r) => r.name },
    { key: "email", header: "Email", render: (r) => r.email },
    { key: "phone", header: "Số điện thoại", render: (r) => r.phone },
    { key: "department", header: "Phòng ban", render: (r) => r.department },
    { key: "role", header: "Vai trò", render: (r) => r.role },
    { key: "status", header: "Trạng thái", render: (r) => <StatusBadge status={r.status} /> },
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
        eyebrow="Quản lý / Nhân viên"
        title="Nhân viên"
        description="Danh sách nhân viên Guardian, phân theo phòng ban và trạng thái làm việc."
        actions={<Button variant="primary">+ Thêm nhân viên</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5">
          <Input
            placeholder="Tìm kiếm theo mã, họ tên, email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            options={DEPARTMENTS}
          />
        </div>
        <div className="md:col-span-2">
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={ROLES}
          />
        </div>
        <div className="md:col-span-2">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={STATUSES}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.code}
        empty="Không tìm thấy nhân viên phù hợp"
      />
    </div>
  );
};

export default Employees;