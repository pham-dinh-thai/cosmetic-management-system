import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, Input, Button, Card } from "../../../../components/ui/Primitives";
import { customersService } from "../../../../services/customers.service";
import { toast } from "sonner";

const EditCustomerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (id) {
      customersService.getCustomerById(id)
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
            firstName: nameParts.firstName,
            lastName: nameParts.lastName,
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
          });
        })
        .catch(err => {
          console.error(err);
          toast.error("Không thể tải thông tin khách hàng");
          navigate("/admin/customers");
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Vui lòng nhập đầy đủ họ và tên đệm lẫn tên riêng");
      return;
    }

    setLoading(true);
    try {
      await customersService.updateCustomer(id, {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      });
      toast.success("Đã cập nhật khách hàng");
      navigate("/admin/customers");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi cập nhật khách hàng");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="py-12 text-center text-[#666666]">Đang tải thông tin khách hàng…</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Khách hàng / Cập nhật"
        title="Cập nhật khách hàng"
        description="Chỉnh sửa thông tin khách hàng."
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
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditCustomerPage;
