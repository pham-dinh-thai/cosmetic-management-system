import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Input, Button, Card } from "../../../../components/ui/Primitives";
import { customersService } from "../../../../services/customers.service";
import { toast } from "sonner";

const AddCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Vui lòng nhập đầy đủ họ và tên đệm lẫn tên riêng");
      return;
    }
    setLoading(true);
    try {
      await customersService.createCustomer({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      });
      toast.success("Đã thêm khách hàng");
      navigate("/admin/customers");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi thêm khách hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Khách hàng / Thêm mới"
        title="Thêm khách hàng"
        description="Nhập thông tin khách hàng mới."
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
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ví dụ: 0912345678"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ví dụ: nguyenvana@gmail.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium uppercase tracking-wider text-[#666666]">
              Địa chỉ
            </label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ví dụ: 123 Đường ABC, Quận X"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#eeeee9]">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/customers")}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Đang lưu..." : "Thêm khách hàng"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddCustomerPage;
