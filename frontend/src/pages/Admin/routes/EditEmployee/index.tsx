import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, Input, Button, Card, Select } from "../../../../components/ui/Primitives";
import { employeesService } from "../../../../services/employees.service";
import { departmentsService } from "../../../../services/departments.service";
import type { Department } from "../Departments/type";
import type { Employee } from "../Employees/type";
import { toast } from "sonner";

const EditEmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState<
    Partial<Employee> & { firstName: string; lastName: string }
  >({
    name: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    departmentId: "",
    position: "",
    status: "ACTIVE",
    hiredAt: "",
  });

  useEffect(() => {
    departmentsService.getDepartments().then((data) => setDepartments(data));
  }, []);

  useEffect(() => {
    if (id) {
      employeesService.getEmployeeById(id)
        .then(data => {
          const fullName = (data.name || "").trim();
          const lastSpaceIndex = fullName.lastIndexOf(" ");
          const nameParts =
            lastSpaceIndex === -1
              ? { firstName: fullName, lastName: "" }
              : {
                  firstName: fullName.slice(0, lastSpaceIndex),
                  lastName: fullName.slice(lastSpaceIndex + 1),
                };
          setFormData({
            name: data.name || "",
            firstName: nameParts.firstName,
            lastName: nameParts.lastName,
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            departmentId: data.departmentId || "",
            position: data.position || "",
            status: (data.status as Employee["status"]) || "ACTIVE",
            hiredAt: data.hiredAt ? new Date(data.hiredAt).toISOString().split('T')[0] : "",
          });
        })
        .catch(err => {
          console.error(err);
          toast.error("Không thể tải thông tin nhân viên");
          navigate("/admin/employees");
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.firstName.trim() && !formData.lastName.trim()) {
      toast.error("Vui lòng nhập họ hoặc tên");
      return;
    }

    setLoading(true);
    try {
      await employeesService.updateEmployee(id, {
        ...formData,
        name: [formData.firstName.trim(), formData.lastName.trim()]
          .filter(Boolean)
          .join(" "),
      });
      toast.success("Đã cập nhật nhân viên thành công");
      navigate("/admin/employees");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi cập nhật nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = departments.map((d) => ({ value: d.id, label: d.name }));
  const currentInOptions = departmentOptions.some(
    (o) => o.value === formData.departmentId,
  );
  const allDepartmentOptions =
    formData.departmentId && !currentInOptions
      ? [
          ...departmentOptions,
          {
            value: formData.departmentId,
            label: formData.departmentId,
          },
        ]
      : departmentOptions;

  const positionOptions = [
    { value: "staff", label: "Nhân viên" },
    { value: "manager", label: "Quản lý" },
  ];

  const currentPositionInOptions = positionOptions.some(
    (o) => o.value === formData.position,
  );
  const allPositionOptions =
    formData.position && !currentPositionInOptions
      ? [...positionOptions, { value: formData.position, label: formData.position }]
      : positionOptions;

  if (fetching) {
    return <div className="py-12 text-center text-[#666666]">Đang tải thông tin nhân viên…</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Nhân viên / Cập nhật"
        title="Cập nhật nhân viên"
        description="Chỉnh sửa thông tin nhân viên."
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
                  ...allDepartmentOptions,
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
                  ...allPositionOptions,
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
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditEmployeePage;
