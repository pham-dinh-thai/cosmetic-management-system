import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, Input, Button, Card, Select } from "../../../../components/ui/Primitives";
import { departmentsService } from "../../../../services/departments.service";
import type { Department } from "../Departments/type";

const EditDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<Partial<Department>>({
    name: "",
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      departmentsService.getDepartmentById(id)
        .then(data => {
          setFormData({
            name: data.name || "",
            isActive: data.isActive,
          });
        })
        .catch(err => {
          console.error(err);
          alert("Không thể tải thông tin phòng ban");
          navigate("/admin/departments");
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "isActive" ? value === "true" : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setLoading(true);
    try {
      await departmentsService.updateDepartment(id, formData);
      navigate("/admin/departments");
    } catch (error) {
      console.error(error);
      alert("Đã có lỗi xảy ra khi cập nhật phòng ban");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="py-12 text-center text-[#666666]">Đang tải thông tin phòng ban…</div>;
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
                Trạng thái
              </label>
              <Select
                name="isActive"
                value={formData.isActive ? "true" : "false"}
                onChange={handleChange}
                options={[
                  { value: "true", label: "Đang hoạt động" },
                  { value: "false", label: "Tạm ngưng" },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#eeeee9]">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/departments")}>
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
