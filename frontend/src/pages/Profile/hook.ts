import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { customersService } from "../../services/customers.service";
import { employeesService } from "../../services/employees.service";
import { authService } from "../../services/auth.service";
import { userService } from "../../services/user.service";
import type { ProfileFormData, PasswordFormData } from "./type";
import { toast } from "sonner";

export function useProfile() {
  const user = useAuthStore((s) => s.user);
  const setUserProfile = useAuthStore((s) => s.setUserProfile);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [addresses, setAddresses] = useState<
    { id: string; city: string; street: string }[]
  >([]);
  const [newAddress, setNewAddress] = useState("");
  const [isAddressSaving, setIsAddressSaving] = useState(false);

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

  // User-service là nguồn hồ sơ chung. Danh sách địa chỉ dùng customer-service
  // cho mọi user, nên một tài khoản có thể có nhiều địa chỉ giao hàng.
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const profile = await userService.getMe();

        if (!cancelled && profile) {
          setFormData({
            firstName: profile.firstName ?? "",
            lastName: profile.lastName ?? "",
            email: profile.email || user.email || "",
            phone: user.phone ?? "",
            gender: profile.gender || "female",
            address: user.address ?? "",
          });

          const customerProfile = await customersService.getMe();
          if (!cancelled && customerProfile) {
            setAddresses(customerProfile.addresses ?? []);

            if (user.role === "customer") {
              setFormData((current) => ({
                ...current,
                phone: customerProfile.phone ?? "",
              }));
            }
          }

          if (user.role !== "customer") {
            const employee = (await employeesService.getEmployees()).find(
              (item) => item.userId === user.id,
            );
            if (!cancelled && employee) {
              setFormData((current) => ({
                ...current,
                phone: employee.phone ?? "",
              }));
            }
          }
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
  }, [user?.id, user?.email]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
      const phone = formData.phone.trim();

      await userService.updateMe({
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
      });

      if (user.role === "customer") {
        let profile = await customersService.getMe();

        if (!profile && phone) {
          profile = await customersService.ensureMe();
        }

        if (profile) {
          if (phone && phone !== (profile.phone ?? "")) {
            await customersService.addMyPhone(phone);
          }

        }
      } else {
        const employee = (await employeesService.getEmployees()).find(
          (item) => item.userId === user.id,
        );

        if (employee) {
          await employeesService.updateEmployee(employee.id, {
            name: [formData.firstName, formData.lastName]
              .filter(Boolean)
              .join(" "),
            gender: formData.gender,
            phone: phone || undefined,
          });
        }
      }

      syncStore();
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Không thể cập nhật thông tin. Vui lòng thử lại.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const refreshAddresses = async () => {
    const profile = await customersService.getMe();
    setAddresses(profile?.addresses ?? []);
  };

  const handleAddAddress = async () => {
    const street = newAddress.trim();
    if (!street) {
      toast.error("Vui lòng nhập địa chỉ.");
      return;
    }

    setIsAddressSaving(true);
    try {
      let profile = await customersService.getMe();
      if (!profile) profile = await customersService.ensureMe();
      await customersService.addMyAddress(street);
      await refreshAddresses();
      setNewAddress("");
      toast.success("Đã thêm địa chỉ.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Không thể thêm địa chỉ.");
    } finally {
      setIsAddressSaving(false);
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    if (addresses.length <= 1) {
      toast.error("Mỗi người dùng phải có ít nhất một địa chỉ.");
      return;
    }

    setIsAddressSaving(true);
    try {
      await customersService.removeMyAddress(addressId);
      await refreshAddresses();
      toast.success("Đã xóa địa chỉ.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Không thể xóa địa chỉ.");
    } finally {
      setIsAddressSaving(false);
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
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          "Lỗi khi đổi mật khẩu. Vui lòng thử lại.",
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
  };
}
