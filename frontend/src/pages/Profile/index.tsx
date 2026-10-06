import React from "react";
import Header from "../../components/Header";
import { PageHeader, Button, Card, Input } from "../../components/ui/Primitives";
import { useProfile } from "./hook";

const ProfilePage: React.FC = () => {
  const {
    user,
    isLoading,
    isSaving,
    isPasswordSaving,
    isAddressSaving,
    formData,
    passwordData,
    addresses,
    newAddress,
    handleInputChange,
    handlePasswordChange,
    handleSaveProfile,
    handleSavePassword,
    setNewAddress,
    handleAddAddress,
    handleRemoveAddress,
  } = useProfile();

  // Thông tin từ token: sub, email, roleId, departmentCode, position
  const userDisplayName = [formData.lastName, formData.firstName].filter(Boolean).join(" ") || user?.email || "—";

  const userRoleDisplay =
    user?.role === "admin"
      ? "Quản trị viên (Admin)"
      : !user?.role || user?.role === "customer"
      ? "Khách hàng"
      : "Nhân viên";

  const avatarPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&background=1c3a13&color=fcfcf7&size=128`;

  return (
    <div className="min-h-screen bg-[#fcfcf7] flex flex-col text-[#1c3a13]">
      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-12 py-10 flex flex-col gap-10">
        <PageHeader
          eyebrow="Tài khoản / Cá nhân"
          title="Thông tin cá nhân"
          description="Quản lý hồ sơ, cập nhật thông tin liên hệ và bảo mật tài khoản."
        />

        <Card className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#f7f7f2] border border-[#eeeee9]">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={avatarPlaceholder}
                alt={userDisplayName}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#1c3a13] shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#d3fa99] border-2 border-white rounded-full" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[22px] font-medium text-[#1c3a13]">{userDisplayName}</h2>
              <span className="text-[14px] text-[#666666]">{user?.email}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-[0.15em] bg-[#1c3a13] text-[#fcfcf7]">
                  {userRoleDisplay}
                </span>
                {user?.departmentCode && (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#eeeee9] text-[#1c3a13]">
                    Phòng: {user.departmentCode}
                  </span>
                )}
                {user?.position && (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#d3fa99] text-[#1c3a13]">
                    {user.position}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 p-8 flex flex-col gap-6">

            {isLoading ? (
              <div className="flex flex-col gap-6" aria-busy="true">
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className="h-[48px] rounded-[12px] bg-[#eeeee9] animate-pulse"
                  />
                ))}
                <div className="h-[120px] rounded-[12px] bg-[#eeeee9] animate-pulse" />
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">
                    Họ và tên đệm
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên đệm..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">
                    Tên
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">
                    Email <span className="text-[#aaa] normal-case tracking-normal"></span>
                  </label>
                  <Input
                    name="email"
                    value={formData.email}
                    disabled
                    className="bg-[#eeeee9] cursor-not-allowed opacity-70"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">
                    Số điện thoại
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0912 xxx xxx"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">
                  Giới tính
                </label>
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

              <div className="flex justify-end pt-4 border-t border-[#eeeee9]">
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
              </form>
            )}

            <div className="border-t border-[#eeeee9] pt-6 flex flex-col gap-4">
              <div>
                <h3 className="text-[18px] font-medium text-[#1c3a13]">Địa chỉ giao hàng</h3>
                <p className="text-[13px] text-[#666666] mt-1">Bạn có thể lưu nhiều địa chỉ để dùng khi đặt hàng.</p>
              </div>
              {addresses.length > 0 && (
                <div className="flex flex-col gap-2">
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-center justify-between gap-4 rounded-[12px] border border-[#eeeee9] px-4 py-3">
                      <span className="text-[14px] text-[#1c3a13]">{[address.street, address.city].filter(Boolean).join(", ")}</span>
                      <Button type="button" variant="primary" onClick={() => handleRemoveAddress(address.id)} disabled={isAddressSaving || addresses.length <= 1} className="!bg-red-600 hover:!bg-red-700 disabled:!bg-red-300">Xóa</Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <Input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
                <Button type="button" variant="outline" onClick={handleAddAddress} disabled={isAddressSaving}>{isAddressSaving ? "Đang lưu..." : "Thêm địa chỉ"}</Button>
              </div>
            </div>
          </Card>

          {/* Right Form: Change Password */}
          <Card className="p-8 flex flex-col gap-6 h-fit">
            <div className="border-b border-[#eeeee9] pb-4">
              <h3 className="text-[20px] font-medium text-[#1c3a13]">Bảo mật & Mật khẩu</h3>
              <p className="text-[13px] text-[#666666] mt-1">
                Đổi mật khẩu định kỳ để đảm bảo an toàn tài khoản.
              </p>
            </div>

            <form onSubmit={handleSavePassword} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">
                  Mật khẩu hiện tại
                </label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">
                  Mật khẩu mới
                </label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#666666]">
                  Xác nhận mật khẩu mới
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full" disabled={isPasswordSaving}>
                  {isPasswordSaving ? "Đang đổi..." : "Cập nhật mật khẩu"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
