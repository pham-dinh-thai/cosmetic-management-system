export interface DepartmentManager {
  id: string;
  code: string;
  name: string;
  position: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  managerId: string | null;
  manager: DepartmentManager | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
