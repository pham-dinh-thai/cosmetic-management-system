import { userService, type UpdateProfilePayload } from "../../../../services/user.service";

export const profileApi = {
  getProfile: (userId: string) => userService.getProfile(userId),
  updateProfile: (userId: string, payload: UpdateProfilePayload) =>
    userService.updateProfile(userId, payload),
};
