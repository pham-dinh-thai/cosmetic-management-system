import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PageHeader,
  Input,
  Button,
  Card,
  Select,
} from "../../../../components/ui/Primitives";
import { employeesService } from "../../../../services/employees.service";
import { departmentsService } from "../../../../services/departments.service";
import { rolesService, type RoleSummary } from "../../../../services/roles.service";
import { userService } from "../../../../services/user.service";
import type { Department } from "../Departments/type";
import type { Employee } from "../Employees/type";
import { isValidMobilePhone } from "../../../../lib/validators";
import { friendlyErrorMessage } from "../../../../lib/apiError";
import { toast } from "sonner";

const EditEmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [roleId, setRoleId] = useState("");
  const [initialRoleId, setInitialRoleId] = useState("");
  const [employeeUserId, setEmployeeUserId] = useState("");
  const [initialDepartmentId, setInitialDepartmentId] = useState("");
  const [initialPosition, setInitialPosition] = useState("");
  const [formData, setFormData] = useState<
    Partial<Employee> & { firstName: string; lastName: string }
  >({
    name: "",
    firstName: "",
    lastName: "",
    gender: "other",
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
    rolesService.findAll().then((data) => setRoles(data));
  }, []);

  useEffect(() => {
    if (id) {
      employeesService
        .getEmployeeById(id)
        .then((data) => {
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
            gender: data.gender || "other",
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            departmentId: data.departmentId || "",
            position: data.position || "",
            status: (data.status as Employee["status"]) || "ACTIVE",
            hiredAt: data.hiredAt
              ? new Date(data.hiredAt).toISOString().split("T")[0]
              : "",
          });
          setInitialDepartmentId(data.departmentId || "");
          setInitialPosition(data.position || "");
          setRoleId(data.roleId || "");
          setInitialRoleId(data.roleId || "");
          setEmployeeUserId(data.userId || "");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Không thể tải thông tin nhân viên");
          navigate("/employees");
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
    if ((formData.phone || "").trim() && !isValidMobilePhone(formData.phone || "")) {
      toast.error(
        "Số điện thoại không hợp lệ (phải là 10 số, bắt đầu 03/05/07/08/09)",
      );
      return;
    }

    setLoading(true);
    try {
      await employeesService.updateEmployee(id, {
        ...formData,
        name: [formData.firstName.trim(), formData.lastName.trim()]
          .filter(Boolean)
          .join(" "),
        previousDepartmentId: initialDepartmentId,
        previousPosition: initialPosition,
      });

      // Tách riêng: đổi vai trò dùng public API /users/:userId/role
      if (roleId && roleId !== initialRoleId && employeeUserId) {
        await userService.updateRole(employeeUserId, roleId);
      }

      toast.success("Đã cập nhật nhân viên thành công");
      navigate("/employees");
    } catch (error) {
      console.error(error);
      toast.error(
        friendlyErrorMessage(error, "Đã có lỗi xảy ra khi cập nhật nhân viên"),
      );
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = departments
    .filter((d) => d.isActive)
    .map((d) => ({
      value: d.id,
      label: d.name,
    }));
  const currentInOptions = departmentOptions.some(
    (o) => o.value === formData.departmentId,
  );
  const currentDepartment = departments.find(
    (d) => d.id === formData.departmentId,
  );
  const allDepartmentOptions =
    formData.departmentId && !currentInOptions
      ? [
          ...departmentOptions,
          {
            value: formData.departmentId,
            label: currentDepartment ? currentDepartment.name : "Phòng ban đã đóng",
          },
        ]
      : departmentOptions;

  const positionOptions = [
    { value: "staff", label: "Nhân viên" },
    { value: "manager", label: "Quản lý" },
  ];

  const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
  ];

  const currentPositionInOptions = positionOptions.some(
    (o) => o.value === formData.position,
  );
  const allPositionOptions =
    formData.position && !currentPositionInOptions
      ? [
          ...positionOptions,
          { value: formData.position, label: formData.position },
        ]
      : positionOptions;

  const activeRoleOptions = roles
    .filter((r) => r.isActive)
    .map((r) => ({ value: r.id, label: r.name }));
  const currentRoleInOptions = activeRoleOptions.some(
    (o) => o.value === roleId,
  );
  const currentRole = roles.find((r) => r.id === roleId);
  const allRoleOptions =
    roleId && !currentRoleInOptions
      ? [
          ...activeRoleOptions,
          {
            value: roleId,
            label: currentRole ? currentRole.name : "Vai trò đã xóa",
          },
        ]
      : activeRoleOptions;

  if (fetching) {
    return (
      <div className="py-12 text-center text-[#666666]">
        Đang tải thông tin nhân viên…
      </div>
    );
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
                Giới tính <span className="text-red-500">*</span>
              </label>
              <Select
                name="gender"
                value={formData.gender || "other"}
                onChange={handleChange}
                options={genderOptions}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Vai trò đăng nhập <span className="text-red-500">*</span>
              </label>
              <Select
                name="roleId"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                options={[
                  { value: "", label: "Chọn vai trò đăng nhập" },
                  ...allRoleOptions,
                ]}
              />
              <p className="text-[11px] text-[#666666]">
                Vai trò quyết định quyền truy cập. Thay đổi sẽ áp dụng sau khi
                nhân viên đăng nhập lại.
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
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/employees")}
            >
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
