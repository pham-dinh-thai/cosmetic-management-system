import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { customersService, splitName } from "../../services/customers.service";
import { authService } from "../../services/auth.service";
import { profileApi } from "./api";
import type { ProfileFormData, PasswordFormData } from "./type";
import { toast } from "sonner";

export function useProfile() {
  const user = useAuthStore((s) => s.user);
  const setUserProfile = useAuthStore((s) => s.setUserProfile);

  const isCustomer = user?.role === "customer";
  const [isLoading, setIsLoading] = useState(isCustomer);
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
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load hồ sơ thật từ backend (chỉ khách hàng mới có hồ sơ ở customer-service)
  useEffect(() => {
    if (!isCustomer || !user?.id) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        let profile = await customersService.getMe();

        if (!profile) {
          await customersService.ensureMe();
          profile = await customersService.getMe();
        }

        if (!cancelled && profile) {
          const { firstName, lastName } = splitName(profile.name ?? "");

          setFormData({
            firstName,
            lastName,
            email: profile.email || user.email || "",
            phone: profile.phone ?? "",
            gender: profile.gender || "female",
            address: profile.address ?? "",
          });
        }
      } catch {
        // Không load được thì giữ nguyên dữ liệu hiện có trong store
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isCustomer, user?.id, user?.email]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const syncStore = () => {
    setUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      gender: formData.gender,
      address: formData.address,
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    try {
      if (isCustomer) {
        await customersService.updateMe({
          user: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender: formData.gender,
          },
          phone: formData.phone,
          address: formData.address,
        });
      } else {
        await profileApi.updateProfile(user.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          gender: formData.gender,
          address: formData.address,
        });
      }
      syncStore();
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error: any) {
      if (isCustomer) {
        toast.error(
          error?.response?.data?.message ??
            "Không thể cập nhật thông tin. Vui lòng thử lại.",
        );
      } else {
        // Nhân viên/Admin chưa có endpoint tự cập nhật → chỉ lưu vào Zustand để UX không bị gián đoạn
        syncStore();
        toast.success("Đã lưu thông tin cá nhân!");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Bạn chưa đăng nhập.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }
    setIsPasswordSaving(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        newPasswordConfirmation: passwordData.confirmPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Lỗi khi đổi mật khẩu. Vui lòng thử lại.",
      );
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return {
    user,
    isLoading,
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