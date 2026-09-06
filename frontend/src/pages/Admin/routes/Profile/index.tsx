import React from "react";
import { PageHeader, Button, Card, Input } from "../../../../components/ui/Primitives";
import { useAdminProfile } from "./hook";

const AdminProfilePage: React.FC = () => {
  const {
    user,
    isSaving,
    isPasswordSaving,
    formData,
    passwordData,
    handleInputChange,
    handlePasswordChange,
    handleSaveProfile,
    handleSavePassword,
  } = useAdminProfile();

  // Thông tin từ token: sub, email, roleId, departmentCode, position
  const userDisplayName = [formData.lastName, formData.firstName].filter(Boolean).join(" ") || user?.email || "—";
  const avatarPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&background=1c3a13&color=fcfcf7&size=128`;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <PageHeader
        eyebrow="Tài khoản / Quản trị"
        title="Hồ sơ Admin"
        description="Thông tin tài khoản quản trị. Email và ID được lấy trực tiếp từ hệ thống."
      />

      {/* User Card — dữ liệu từ token */}
      <Card className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#f7f7f2] border border-[#eeeee9]">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={formData.avatar || avatarPlaceholder}
              alt={userDisplayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#1c3a13] shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#d3fa99] border-2 border-white rounded-full" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-[22px] font-medium text-[#1c3a13]">{userDisplayName}</h2>
            {/* email từ token */}
            <span className="text-[14px] text-[#666666]">{user?.email}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-[0.15em] bg-[#1c3a13] text-[#fcfcf7]">
                Quản trị viên (Admin)
              </span>
              {/* departmentCode từ token */}
              {user?.departmentCode && (
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#eeeee9] text-[#1c3a13]">
                  Phòng: {user.departmentCode}
                </span>
              )}
              {/* position từ token */}
              {user?.position && (
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#d3fa99] text-[#1c3a13]">
                  {user.position}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* sub (User ID) từ token */}
        <div className="text-right text-[13px] text-[#666666]">
          User ID:{" "}
          <span className="font-mono text-[#1c3a13] font-medium text-[12px]">{user?.id}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Personal Info */}
        <Card className="lg:col-span-2 p-8 flex flex-col gap-6">
          <div className="border-b border-[#eeeee9] pb-4">
            <h3 className="text-[20px] font-medium text-[#1c3a13]">Thông tin cá nhân</h3>
            <p className="text-[13px] text-[#666666] mt-1">
              Cập nhật thêm thông tin liên hệ. Email và ID không thể thay đổi.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">Họ và tên đệm</label>
                <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Nhập họ..." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">Tên</label>
                <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Nhập tên..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">
                  Email <span className="text-[#aaa] normal-case tracking-normal">(từ token – chỉ đọc)</span>
                </label>
                <Input name="email" value={formData.email} disabled className="bg-[#eeeee9] opacity-70 cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">Số điện thoại</label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0912 xxx xxx" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full h-[48px] px-4 rounded-[12px] border border-[#1c3a13] bg-[#fcfcf7] text-[14px] text-[#1c3a13] outline-none"
                >
                  <option value="female">Nữ</option>
                  <option value="male">Nam</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">URL ảnh đại diện</label>
                <Input name="avatar" value={formData.avatar} onChange={handleInputChange} placeholder="https://..." />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#eeeee9]">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Right Form: Change Password */}
        <Card className="p-8 flex flex-col gap-6 h-fit">
          <div className="border-b border-[#eeeee9] pb-4">
            <h3 className="text-[20px] font-medium text-[#1c3a13]">Bảo mật</h3>
          </div>

          <form onSubmit={handleSavePassword} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">Mật khẩu hiện tại</label>
              <Input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">Mật khẩu mới</label>
              <Input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">Xác nhận mật khẩu mới</label>
              <Input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" required />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="outline" className="w-full" disabled={isPasswordSaving}>
                {isPasswordSaving ? "Đang đổi..." : "Đổi mật khẩu"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfilePage;
