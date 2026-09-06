import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Card, Select } from "../../../../components/ui/Primitives";
import { suppliersService } from "../../../../services/suppliers.service";
import type { Supplier } from "../Suppliers/type";

const AddSupplierPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: "",
    phone: "",
    email: "",
    address: "",
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "isActive" ? value === "true" : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await suppliersService.createSupplier(formData);
      navigate("/admin/suppliers");
    } catch (error) {
      console.error(error);
      alert("Đã có lỗi xảy ra khi thêm nhà cung cấp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Nhà cung cấp / Thêm mới"
        title="Thêm nhà cung cấp"
        description="Nhập thông tin nhà cung cấp mới."
      />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
              Tên nhà cung cấp <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              required
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Ví dụ: Công ty Cổ phần Mỹ phẩm ABC"
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
                placeholder="Ví dụ: 02838321456"
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
                placeholder="Ví dụ: contact@abc.vn"
              />
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
                  { value: "false", label: "Ngừng HĐ" },
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
              placeholder="Ví dụ: 123 Đường ABC, Quận X, TP.HCM"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#eeeee9]">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/suppliers")}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Đang lưu..." : "Thêm nhà cung cấp"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddSupplierPage;
