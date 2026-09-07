import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Card, Select } from "../../../../components/ui/Primitives";
import { departmentsService } from "../../../../services/departments.service";
import type { Department } from "../Departments/type";
import { toast } from "sonner";

const AddDepartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Department>>({
    code: "",
    name: "",
    positions: [],
    isActive: true,
  });
  const [positionInput, setPositionInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "isActive" ? value === "true" : value 
    }));
  };

  const handleAddPosition = () => {
    if (positionInput.trim() && !formData.positions?.includes(positionInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        positions: [...(prev.positions || []), positionInput.trim()],
      }));
      setPositionInput("");
    }
  };

  const handleRemovePosition = (posToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions?.filter((p) => p !== posToRemove) || [],
    }));
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

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
              Các chức vụ trực thuộc
            </label>
            <div className="flex gap-2">
              <Input
                value={positionInput}
                onChange={(e) => setPositionInput(e.target.value)}
                placeholder="Ví dụ: Nhân viên bán hàng"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPosition();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddPosition}>Thêm</Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.positions?.map((pos, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-[#eeeee9] text-[#1c3a13] px-3 py-1 rounded-full text-sm">
                  <span>{pos}</span>
                  <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => handleRemovePosition(pos)}>
                    &times;
                  </button>
                </div>
              ))}
              {(!formData.positions || formData.positions.length === 0) && (
                <span className="text-sm text-gray-500 italic">Chưa có chức vụ nào được thêm</span>
              )}
            </div>
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
              {loading ? "Đang lưu..." : "Thêm phòng ban"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddDepartmentPage;
