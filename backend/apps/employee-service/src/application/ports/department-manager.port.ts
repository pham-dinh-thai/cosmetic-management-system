export interface IDepartmentManagerPort {
  /**
   * Xóa nhân viên khỏi vai trò trưởng phòng ở mọi phòng ban
   * (gọi orchestration sang department-service).
   */
  unassignManager(employeeId: string): Promise<void>;
}

export const DEPARTMENT_MANAGER_PORT = 'IDepartmentManagerPort';