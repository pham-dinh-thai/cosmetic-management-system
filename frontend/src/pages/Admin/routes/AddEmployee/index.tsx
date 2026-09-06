import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Card, Select } from "../../../../components/ui/Primitives";
import { employeesService } from "../../../../services/employees.service";
import type { Employee } from "../Employees/type";

const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    phone: "",
    email: "",
    address: "",
    departmentId: "",
    position: "MEMBER",
    status: "ACTIVE",
    hiredAt: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await employeesService.createEmployee(formData);
      navigate("/admin/employees");
    } catch (error) {
      console.error(error);
      alert("Đã có lỗi xảy ra khi thêm nhân viên");
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
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              required
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Ví dụ: Nguyễn Văn A"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                name="phone"
                required
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
                Phòng ban
              </label>
              <Input
                name="departmentId"
                value={formData.departmentId || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Kế toán"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Chức vụ <span className="text-red-500">*</span>
              </label>
              <Select
                name="position"
                required
                value={formData.position || "MEMBER"}
                onChange={handleChange}
                options={[
                  { value: "MEMBER", label: "Nhân viên" },
                  { value: "MANAGER", label: "Quản lý" },
                  { value: "DIRECTOR", label: "Giám đốc" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
