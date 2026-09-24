import api from "../config/axios";
import type { UserProfile } from "../store/useAuthStore";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  gender?: string;
}

export const userService = {
  /**
   * Lấy thông tin profile mở rộng của người dùng từ backend.
   * Token payload chỉ chứa: sub, email, roleId, departmentCode, position.
   * Các trường bổ sung (firstName, lastName, phone, avatar, address, gender)
   * được lưu vào Zustand store sau khi người dùng tự điền và cập nhật.
   */
  async getProfile(_userId: string): Promise<Partial<UserProfile>> {
    // Backend hiện tại không có endpoint GET /users/:id công khai cho người dùng thường.
    // Token payload là nguồn dữ liệu chính — không cần fetch thêm.
    return {};
  },

  async updateProfile(userId: string, payload: UpdateProfilePayload): Promise<void> {
    await api.patch(`/users/${userId}`, payload);
  },

  /**
   * Đổi vai trò (quyền) của một người dùng. Endpoint admin-only,
   * dùng chung cho màn hình Nhân viên (chỉnh sửa vai trò).
   */
  async updateRole(userId: string, roleId: string): Promise<void> {
    await api.patch(`/users/${userId}/role`, { roleId });
  },
};
