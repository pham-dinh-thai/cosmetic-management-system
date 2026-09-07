export interface Department {
  id: string;
  code: string;
  name: string;
  managerId: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
