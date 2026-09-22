export interface IChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
