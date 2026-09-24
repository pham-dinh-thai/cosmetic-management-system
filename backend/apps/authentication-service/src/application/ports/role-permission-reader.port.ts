export interface IRolePermissionReaderPort {
  findByRoleId(roleId: string): Promise<string[]>;
}

export const ROLE_PERMISSION_READER_PORT = 'IRolePermissionReaderPort';