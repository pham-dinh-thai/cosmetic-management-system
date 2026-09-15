import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PageHeader,
  Input,
  Button,
  Card,
  Select,
} from "../../../../components/ui/Primitives";
import { departmentsService } from "../../../../services/departments.service";
import {
  employeesService,
  combineName,
} from "../../../../services/employees.service";
import type { Department } from "../Departments/type";
import { toast } from "sonner";

interface ManagerOption {
  id: string;
  code: string;
  name: string;
}

const EditDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [managerOptions, setManagerOptions] = useState<ManagerOption[]>([]);
  const [formData, setFormData] = useState<Partial<Department>>({
    code: "",
    name: "",
  });

  useEffect(() => {
    if (id) {
      Promise.all([
        departmentsService.getDepartmentById(id),
        employeesService.getEmployees(),
      ])
        .then(([data, employees]) => {
          setFormData({
            code: data.code || "",
            name: data.name || "",
            managerId: data.managerId || null,
          });
          setManagerOptions(
            employees
              .filter(
                (e) =>
                  e.departmentId === id &&
                  e.position === "manager" &&
                  e.status === "ACTIVE",
              )
              .map((e) => ({
                id: e.id,
                code: e.code,
                name: combineName(e.firstName, e.lastName),
              })),
          );
        })
        .catch((err) => {
          console.error(err);
          toast.error("Không thể tải thông tin phòng ban");
          navigate("/departments");
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignManager = async (employeeId: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await departmentsService.assignManager(id, employeeId || null);
      setFormData((prev) => ({ ...prev, managerId: employeeId || null }));
      toast.success(
        employeeId
          ? "Đã gán trưởng phòng thành công"
          : "Đã xoá trưởng phòng",
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Đã có lỗi xảy ra khi gán trưởng phòng",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    try {
      await departmentsService.updateDepartment(id, formData);
      toast.success("Đã cập nhật phòng ban thành công");
      navigate("/departments");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi cập nhật phòng ban");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-12 text-center text-[#666666]">
        Đang tải thông tin phòng ban…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Phòng ban / Cập nhật"
        title="Cập nhật phòng ban"
        description="Chỉnh sửa thông tin phòng ban."
      />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Mã phòng ban <span className="text-red-500">*</span>
              </label>
              <Input
                name="code"
                required
                maxLength={10}
                value={formData.code || ""}
                onChange={handleChange}
                placeholder="Ví dụ: PB-011"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Tên phòng ban <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                required
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Phòng Kinh doanh"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-[#eeeee9] pt-4">
            <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
              Trưởng phòng
            </label>
            <Select
              value={formData.managerId || ""}
              onChange={(e) => handleAssignManager(e.target.value)}
              options={[
                { value: "", label: "— Chưa có trưởng phòng —" },
                ...managerOptions.map((m) => ({
                  value: m.id,
                  label: `${m.name} (${m.code})`,
                })),
              ]}
            />
            <p className="text-[12px] text-[#666666]">
              Chỉ hiển thị nhân viên giữ chức vụ Quản lý trong phòng ban này.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#eeeee9]">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/departments")}
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

export default EditDepartmentPage;