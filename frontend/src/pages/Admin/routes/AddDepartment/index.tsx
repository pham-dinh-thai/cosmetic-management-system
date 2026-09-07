import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Card } from "../../../../components/ui/Primitives";
import { departmentsService } from "../../../../services/departments.service";
import type { Department } from "../Departments/type";
import { toast } from "sonner";

const AddDepartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Department>>({
    code: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await departmentsService.createDepartment(formData);
      toast.success("Đã thêm phòng ban thành công");
      navigate("/admin/departments");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi thêm phòng ban");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Phòng ban / Thêm mới"
        title="Thêm phòng ban"
        description="Thiết lập phòng ban mới."
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

          <div className="flex justify-end gap-3 pt-4 border-t border-[#eeeee9]">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/departments")}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Đang lưu..." : "Thêm phòng ban"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddDepartmentPage;
