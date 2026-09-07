import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Card, Select } from "../../../../components/ui/Primitives";
import { employeesService } from "../../../../services/employees.service";
import { departmentsService } from "../../../../services/departments.service";
import type { Department } from "../Departments/type";
import type { Employee } from "../Employees/type";
import { toast } from "sonner";

function extractApiMessage(error: unknown): string | null {
  const data = (
    error as { response?: { data?: { message?: string | string[] } } }
  )?.response?.data;
  const message = data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return message ?? null;
}

const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<
    Partial<Employee> & { firstName: string; lastName: string }
  >({
    name: "",
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    departmentId: "",
    position: "",
    status: "ACTIVE",
    hiredAt: new Date().toISOString().split('T')[0],
  });
  const [password, setPassword] = useState("");

  useEffect(() => {
    departmentsService.getDepartments().then((data) => setDepartments(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const departmentOptions = departments
    .filter((d) => d.isActive)
    .map((d) => ({ value: d.id, label: d.name }));

  const positionOptions = [
    { value: "staff", label: "Nhân viên" },
    { value: "manager", label: "Quản lý" },
  ];

  const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.firstName.trim() && !formData.lastName.trim()) {
        toast.error("Vui lòng nhập họ hoặc tên");
        return;
      }
      const { firstName, lastName, ...rest } = formData;
      await employeesService.createEmployee({
        ...rest,
        name: [firstName.trim(), lastName.trim()].filter(Boolean).join(" "),
        password,
      });
      toast.success("Đã thêm nhân viên thành công");
      navigate("/admin/employees");
    } catch (error) {
      console.error(error);
      const message = extractApiMessage(error);
      toast.error(message || "Đã có lỗi xảy ra khi thêm nhân viên");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Nhân viên / Thêm mới"
        title="Thêm nhân viên"
        description="Nhập thông tin nhân viên mới."
      />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Họ và tên đệm <span className="text-red-500">*</span>
              </label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ví dụ: Nguyễn Văn"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Tên riêng <span className="text-red-500">*</span>
              </label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ví dụ: A"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                name="phone"
                required
                maxLength={10}
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Ví dụ: 0912345678"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                name="email"
                required
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Ví dụ: nguyenvana@guardian.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Phòng ban <span className="text-red-500">*</span>
              </label>
              <Select
                name="departmentId"
                required
                value={formData.departmentId || ""}
                onChange={handleChange}
                options={[
                  { value: "", label: "Chọn phòng ban" },
                  ...departmentOptions,
                ]}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Chức vụ <span className="text-red-500">*</span>
              </label>
              <Select
                name="position"
                required
                value={formData.position || ""}
                onChange={handleChange}
                options={[
                  { value: "", label: "Chọn chức vụ" },
                  ...positionOptions,
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Mật khẩu đăng nhập <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                name="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự"
              />
              <p className="text-[11px] text-[#666666]">
                Để trống sẽ dùng mật khẩu mặc định:{" "}
                <code className="font-mono">Employee@123456</code>
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Trạng thái
              </label>
              <Select
                name="status"
                value={formData.status || "ACTIVE"}
                onChange={handleChange}
                options={[
                  { value: "ACTIVE", label: "Đang làm việc" },
                  { value: "INACTIVE", label: "Đã nghỉ" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <Select
                name="gender"
                required
                value={formData.gender || ""}
                onChange={handleChange}
                options={[
                  { value: "", label: "Chọn giới tính" },
                  ...genderOptions,
                ]}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Ngày vào làm
              </label>
              <Input
                type="date"
                name="hiredAt"
                value={formData.hiredAt || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
              Địa chỉ
            </label>
            <Input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Ví dụ: 123 Đường ABC, Quận X"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#eeeee9]">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/employees")}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Đang lưu..." : "Thêm nhân viên"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddEmployeePage;