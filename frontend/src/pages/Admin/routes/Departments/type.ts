export interface Department {
  id: string;
  code: string;
  name: string;
  managerId: string | null;
  positions: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
