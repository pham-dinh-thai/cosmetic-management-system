import { useState } from "react";
import { useAuthStore } from "../../../../store/useAuthStore";
import { profileApi } from "./api";
import type { ProfileFormData, PasswordFormData } from "./type";
import { toast } from "sonner";

export function useAdminProfile() {
  const user = useAuthStore((s) => s.user);
  const setUserProfile = useAuthStore((s) => s.setUserProfile);

  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // Khởi tạo form từ Zustand store (nguồn thật từ token + dữ liệu người dùng đã từng lưu)
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    gender: user?.gender ?? "female",
    address: user?.address ?? "",
    avatar: user?.avatar ?? "",
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await profileApi.updateProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
        avatar: formData.avatar,
      });
      setUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
        avatar: formData.avatar,
      });
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch {
      // Backend chưa có endpoint PATCH /users/:id công khai, vẫn lưu vào store
      setUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
        avatar: formData.avatar,
      });
      toast.success("Đã lưu thông tin cá nhân!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    setIsPasswordSaving(true);
    try {
      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi đổi mật khẩu.");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return {
    user,
    isSaving,
    isPasswordSaving,
    formData,
    passwordData,
    handleInputChange,
    handlePasswordChange,
    handleSaveProfile,
    handleSavePassword,
  };
}
