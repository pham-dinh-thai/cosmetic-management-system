export interface IUpdateUserActiveStatusPort {
  deactivate(userId: string): Promise<void>;
  activate(userId: string): Promise<void>;
}

export const UPDATE_USER_ACTIVE_STATUS_PORT = 'IUpdateUserActiveStatusPort';